import React, { useState, useEffect, useCallback } from 'react';
import { listaProductos, guardarEnCarrito, cargarCarrito, cargarProductos } from '../tienda/tienda';
import { DIVISA, MAX_COPIAS } from '../tienda/tienda';
import BuscadorProductos from './BuscadorProductos';
import Paginacion from './Paginacion';
import DetallesProducto from './DetallesProducto';

const EscaparateProductos = ({ updateCarritoCount, updateCarrito, productosUpdated, mapaCarrito, setCarrito }) => {
    // Estado para el listado de productos y filtrados
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [productosPerPage] = useState(6);
    
    // Estado para filtros
    const [filtroActual, setFiltroActual] = useState({
        tipo: 'all',
        precioMin: 0,
        precioMax: Number.MAX_SAFE_INTEGER,
        ordenamiento: null
    });
    
    // Estado para búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado para mostrar detalles de producto
    const [productoDetalle, setProductoDetalle] = useState(null);
    
    // Estado para mensajes toast/notificación sobre cada producto
    const [notificaciones, setNotificaciones] = useState({});
    
    // Cargar productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setCargando(true);
                setError(null);
                const productosObtenidos = await cargarProductos();
                setProductos(productosObtenidos);
                setProductosFiltrados(productosObtenidos);
            } catch (err) {
                console.error('Error al cargar productos:', err);
                setError('Error al cargar los productos. Por favor, intenta nuevamente.');
            } finally {
                setCargando(false);
            }
        };
        
        fetchProductos();
    }, [productosUpdated]);
    
    // Memorizar función de contador de carrito para evitar recreaciones
    const actualizarContadorCarrito = useCallback(() => {
        let total = 0;
        
        // Preferimos usar mapaCarrito directamente si está disponible
        if (mapaCarrito && mapaCarrito.size > 0) {
            mapaCarrito.forEach((item) => {
                total += item.cantidad;
            });
            updateCarritoCount(total);
        } else {
            // Solo usar cargarCarrito como fallback
            const carritoActual = cargarCarrito();
            carritoActual.forEach((item) => {
                total += item.cantidad;
            });
            updateCarritoCount(total);
        }
    }, [mapaCarrito, updateCarritoCount]);
    
    // Memorizar función para aplicar todos los filtros
    const aplicarTodosFiltros = useCallback((productosBase = productos) => {
        // 1. Comenzar con todos los productos o los filtrados por búsqueda
        let resultados = [...productosBase];
        
        // 2. Aplicar filtro por tipo
        if (filtroActual.tipo !== 'all') {
            resultados = resultados.filter(producto => 
                producto.tipo === filtroActual.tipo
            );
        }
        
        // 3. Aplicar filtro por rango de precio
        resultados = resultados.filter(producto => 
            producto.precio >= filtroActual.precioMin && 
            producto.precio <= filtroActual.precioMax
        );
        
        // 4. Aplicar ordenamiento
        if (filtroActual.ordenamiento) {
            resultados.sort((a, b) => {
                return filtroActual.ordenamiento === 'asc'
                    ? a.precio - b.precio
                    : b.precio - a.precio;
            });
        }
        
        // 5. Actualizar productos filtrados
        setProductosFiltrados(resultados);
    }, [filtroActual, productos]);
    
    // Función para buscar productos
    const buscarProductos = (term) => {
        setSearchTerm(term);
        const termLower = term.toLowerCase();
        
        if (!term) {
            aplicarTodosFiltros(productos);
        } else {
            const filtrados = productos.filter(producto => 
                producto.nombre.toLowerCase().includes(termLower)
            );
            aplicarTodosFiltros(filtrados);
        }
        
        // Reset a la primera página
        setCurrentPage(1);
    };
    
    // Función para resetear filtros
    const resetearFiltros = () => {
        // Crear nuevo objeto de filtro con valores por defecto
        const filtrosDefault = {
            tipo: 'all',
            precioMin: 0,
            precioMax: Number.MAX_SAFE_INTEGER,
            ordenamiento: null
        };
        
        // Actualizar el estado
        setFiltroActual(filtrosDefault);
        
        // Aplicar los filtros directamente, como en actualizarFiltro
        const tempProductos = searchTerm ? 
            productos.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())) : 
            [...productos];
        
        // Simplemente actualizar con todos los productos (con búsqueda si existe)
        setProductosFiltrados([...tempProductos]);
        setCurrentPage(1);
    };
    
    // Función para mostrar el toast/notificación sobre un producto específico
    const mostrarNotificacion = (productId, mensaje, tipo = 'success') => {
        setNotificaciones(prev => ({
            ...prev,
            [productId]: { mensaje, tipo }
        }));
        
        // Ocultar después de 2 segundos
        setTimeout(() => {
            setNotificaciones(prev => {
                const nuevasNotificaciones = { ...prev };
                delete nuevasNotificaciones[productId];
                return nuevasNotificaciones;
            });
        }, 1500);
    };
    
    // Función para añadir producto al carrito
    const agregarAlCarrito = (productId) => {
        // Buscar el producto por ID
        const producto = productos.find(p => String(p.id) === String(productId));
        
        if (!producto) {
            console.error(`Producto con ID ${productId} no encontrado`);
            mostrarNotificacion(productId, 'Producto no encontrado', 'danger');
            return;
        }
        
        console.log(`Añadiendo al carrito: ${producto.nombre} (ID: ${productId})`);
        
        // Crear una copia local del carrito actual
        const carritoActual = new Map(mapaCarrito);
        const productoIdString = String(productId);
        const carritoItem = carritoActual.get(productoIdString);

        // Si el producto ya existe en el carrito
        if (carritoItem) {
            // Verificar si no excede el máximo de copias
            if (carritoItem.cantidad < MAX_COPIAS) {
                carritoItem.cantidad++;
                carritoActual.set(productoIdString, carritoItem);
                guardarEnCarrito(productoIdString, carritoItem);
                mostrarNotificacion(productId, `Añadido (${carritoItem.cantidad})`);
                console.log(`Actualizado ${producto.nombre} a ${carritoItem.cantidad} unidades`);
            } else {
                mostrarNotificacion(productId, `Máximo alcanzado (${MAX_COPIAS})`, 'danger');
                console.log(`No se puede añadir más de ${MAX_COPIAS} unidades`);
                return;
            }
        } else {
            // Si es un producto nuevo
            const nuevoItem = {
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            };
            carritoActual.set(productoIdString, nuevoItem);
            guardarEnCarrito(productoIdString, nuevoItem);
            mostrarNotificacion(productId, `Añadido al carrito`);
            console.log(`Nuevo producto añadido: ${producto.nombre}`);
        }
        
        // Actualizar el estado del carrito
        setCarrito(carritoActual);
        
        // Calcular y actualizar el contador
        let total = 0;
        carritoActual.forEach((item) => {
            total += item.cantidad;
        });
        updateCarritoCount(total);
        console.log(`Total de items en carrito: ${total}`);
        
        // Notificar que el carrito ha sido actualizado
        updateCarrito();
    };
    
    // Función para cambiar página
    const cambiarPagina = (numeroPagina) => {
        setCurrentPage(numeroPagina);
    };
    
    // Función para actualizar filtros
    const actualizarFiltro = (tipoFiltro, valor) => {
        const nuevoFiltro = {...filtroActual};
        
        switch(tipoFiltro) {
            case 'tipo':
                nuevoFiltro.tipo = valor;
                break;
            case 'precioMin':
                nuevoFiltro.precioMin = valor === '' ? 0 : Number(valor);
                break;
            case 'precioMax':
                nuevoFiltro.precioMax = valor === '' ? Number.MAX_SAFE_INTEGER : Number(valor);
                break;
            case 'ordenamiento':
                nuevoFiltro.ordenamiento = valor;
                break;
            default:
                return;
        }
        
        // Actualizar el estado
        setFiltroActual(nuevoFiltro);
        
        // Aplicar los filtros directamente con el nuevo objeto, no con el estado actual
        const tempProductos = searchTerm ? 
            productos.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())) : 
            [...productos];
        
        // 1. Comenzar con todos los productos o los filtrados por búsqueda
        let resultados = [...tempProductos];
        
        // 2. Aplicar filtro por tipo con el nuevo filtro (no con filtroActual)
        if (nuevoFiltro.tipo !== 'all') {
            resultados = resultados.filter(producto => 
                producto.tipo === nuevoFiltro.tipo
            );
        }
        
        // 3. Aplicar filtro por rango de precio con el nuevo filtro
        resultados = resultados.filter(producto => 
            producto.precio >= nuevoFiltro.precioMin && 
            producto.precio <= nuevoFiltro.precioMax
        );
        
        // 4. Aplicar ordenamiento con el nuevo filtro
        if (nuevoFiltro.ordenamiento) {
            resultados.sort((a, b) => {
                return nuevoFiltro.ordenamiento === 'asc'
                    ? a.precio - b.precio
                    : b.precio - a.precio;
            });
        }
        
        // 5. Actualizar productos filtrados
        setProductosFiltrados(resultados);
        
        // Resetear página
        setCurrentPage(1);
    };
    
    // Calcular productos de la página actual
    const indexOfLastProducto = currentPage * productosPerPage;
    const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
    const productosActuales = productosFiltrados.slice(indexOfFirstProducto, indexOfLastProducto);
    
    // Aplicar filtros cuando cambia el listado de productos
    useEffect(() => {
        aplicarTodosFiltros();
    }, [aplicarTodosFiltros, productos]); // Solo dependencias necesarias
    
    // Cargar el contador del carrito de forma independiente
    useEffect(() => {
        // Solo actualizamos el contador, no el carrito
        actualizarContadorCarrito();
    }, [actualizarContadorCarrito, mapaCarrito]);
    
    // Función para obtener campos extra según el tipo de producto
    const getExtraField = (producto) => {
        if (producto.isbn) return `ISBN: ${producto.isbn}`;
        if (producto.tamano) return `Tamaño: ${producto.tamano}KiB`;
        if (producto.resolucion) return `Resolución: ${producto.resolucion}ppp`;
        if (producto.material) return `Material: ${producto.material}`;
        if (producto.color) return `Color: ${producto.color}`;
        return '';
    };
    
    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <span className="ms-3">Cargando productos...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="alert alert-danger">
                <h4 className="alert-heading">Error al cargar productos</h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                    <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
                        Intentar nuevamente
                    </button>
                </p>
            </div>
        );
    }
    
    return (
        <>
            <BuscadorProductos 
                searchTerm={searchTerm}
                buscarProductos={buscarProductos}
                filtroActual={filtroActual}
                actualizarFiltro={actualizarFiltro}
                resetearFiltros={resetearFiltros}
            />
                        
            <div className="row row-cols-1 row-cols-md-3 g-4 mb-4" id="productsGrid">
                {productosActuales.length > 0 ? (
                    productosActuales.map((producto) => (
                        <div className="col" key={producto.id}>
                            <div className="card h-100 position-relative">
                                {/* Notificación sobre el botón de añadir al carrito */}
                                <div className="position-relative">
                                    {notificaciones[producto.id] ? (
                                        <div 
                                            className={`alert alert-${notificaciones[producto.id].tipo} position-absolute end-0 top-0 m-2`}
                                            role="alert"
                                            aria-live="assertive"
                                            aria-atomic="true"
                                            style={{
                                                zIndex: 1060,
                                                fontSize: '0.8rem',
                                                padding: '0.25rem 0.5rem',
                                                margin: '0.5rem',
                                                borderRadius: '0.25rem'
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <i className={`bi bi-${notificaciones[producto.id].tipo === 'success' ? 'check-circle' : 'exclamation-circle'}-fill me-1`}></i>
                                                <span>{notificaciones[producto.id].mensaje}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            className="btn btn-primary rounded-circle position-absolute end-0 top-0 m-2 btn-cart"
                                            style={{ width: '40px', height: '40px', zIndex: 1 }}
                                            onClick={() => agregarAlCarrito(producto.id)}
                                        >
                                            <i className="bi bi-cart-plus-fill"></i>
                                        </button>
                                    )}
                                </div>
                                {/* Imagen del producto */}
                                <div className="position-relative" style={{ width: '100%', paddingBottom: '100%' }}>
                                    <img 
                                        src={producto.imagen} 
                                        className="position-absolute top-0 start-0 w-100 h-100 producto-imagen"
                                        style={{ 
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        alt={producto.nombre}
                                        onClick={() => setProductoDetalle(producto)}
                                    />
                                </div>
                                {/* Nombre, precio y descripcion del producto */}
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">{producto.nombre}</h5>
                                    <p className="card-text"><strong>Precio: </strong>{producto.precio}{DIVISA}</p>
                                    <p className="card-text">
                                        <small className="text-muted">{getExtraField(producto)}</small>
                                    </p>
                                    <p 
                                        className="card-text description-truncate" 
                                        style={{ 
                                            display: '-webkit-box', 
                                            WebkitLineClamp: 3, 
                                            WebkitBoxOrient: 'vertical', 
                                            overflow: 'hidden' 
                                        }}
                                    >
                                        {producto.descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <i className="bi bi-search" style={{ fontSize: '48px', opacity: 0.5 }}></i>
                        <h4 className="mt-3">No se encontraron productos</h4>
                        <p className="text-muted">Prueba con otros criterios de búsqueda</p>
                        <button className="btn btn-outline-primary mt-2" onClick={resetearFiltros}>
                            Restablecer filtros
                        </button>
                    </div>
                )}
            </div>
            
            <Paginacion 
                totalProductos={productosFiltrados.length}
                productosActuales={productosActuales}
                currentPage={currentPage}
                productosPerPage={productosPerPage}
                cambiarPagina={cambiarPagina}
            />
            
            {productoDetalle && (
                <DetallesProducto 
                    producto={productoDetalle} 
                    onClose={() => setProductoDetalle(null)} 
                />
            )}
        </>
    );
};

export default EscaparateProductos;