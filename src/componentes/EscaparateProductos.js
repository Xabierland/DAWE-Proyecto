import React, { useState, useEffect, useCallback } from 'react';
import { listaProductos, guardarEnCarrito, cargarCarrito } from '../tienda/tienda';
import { DIVISA, MAX_COPIAS } from '../tienda/tienda';
import BuscadorProductos from './BuscadorProductos';
import Paginacion from './Paginacion';
import DetallesProducto from './DetallesProducto';

const EscaparateProductos = ({ updateCarritoCount, updateCarrito, isOnline, productosUpdated, mapaCarrito, setCarrito }) => {
    // Estado para el listado de productos y filtrados
    const [productos, setProductos] = useState(listaProductos);
    const [productosFiltrados, setProductosFiltrados] = useState([...productos]);
    
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
    
    // Memoizar función de contador de carrito para evitar recreaciones
    const actualizarContadorCarrito = useCallback(() => 
    {
        let total = 0;
        var carritoActual = mapaCarrito;
        if(!mapaCarrito || mapaCarrito.size == 0)
        {
            // Dado que la actualización mediante setCarrito() es asincrona, no usamos el valor de mapaCarrito
            // Si no que usamos el recien obtenido mapaAux
            var mapaAux = cargarCarrito();
            setCarrito(mapaAux);
            carritoActual = mapaAux;
        }
        else
        {
            carritoActual = mapaCarrito;
        }
        carritoActual.forEach((item, id) => 
        {
            total += item.cantidad;
        });

        updateCarritoCount(total);
        // Se crea el aviso 
        updateCarrito(); 
    }, [updateCarritoCount]);
    
    // Memoizar función para aplicar todos los filtros
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
    
    // Función para añadir producto al carrito
    const agregarAlCarrito = (productId) => {
        // Buscar el producto por ID
        const producto = productos.find(p => p.id === productId);
        
        if (!producto) return;
        
        // Si todavia no se ha cargado el carrito (o si esta vacio), se carga
        var carritoActual = mapaCarrito;
        if(!mapaCarrito || mapaCarrito.size == 0)
        {
            // Dado que la actualización mediante setCarrito() es asincrona, no usamos el valor de mapaCarrito
            // Si no que usamos el recien obtenido mapaAux
            var mapaAux = cargarCarrito();
            setCarrito(mapaAux);
            carritoActual = mapaAux;
        }
        else
        {
            carritoActual = mapaCarrito;
        }

        var carritoItem = carritoActual.get(""+productId);
        

        // Si el producto ya existe en el carrito
        if (carritoItem) {
            // Verificar si no excede el máximo de copias
            if (carritoItem.cantidad < MAX_COPIAS) {
                carritoItem.cantidad++;
                guardarEnCarrito(productId, carritoItem);
            } else {
                console.log(`Máximo de copias alcanzado (${MAX_COPIAS})`);
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
            guardarEnCarrito(productId, nuevoItem);
        }
        
        // Actualizar el contador del carrito en el menú
        actualizarContadorCarrito();
        
        // Notificar al App.js que el carrito ha sido actualizado
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
    
    // Recargar productos cuando se añada uno nuevo
    useEffect(() => {
        // Actualizar la lista de productos desde tienda.js
        setProductos([...listaProductos]);
    }, [productosUpdated]);
    
    // Aplicar filtros cuando cambia el listado de productos
    useEffect(() => {
        aplicarTodosFiltros();
        // También cargar el contador del carrito al iniciar
        actualizarContadorCarrito();
    }, [productos, aplicarTodosFiltros, actualizarContadorCarrito]);
    
    // Función para obtener campos extra según el tipo de producto
    const getExtraField = (producto) => {
        if (producto.isbn) return `ISBN: ${producto.isbn}`;
        if (producto.tamano) return `Tamaño: ${producto.tamano}KiB`;
        if (producto.resolucion) return `Resolución: ${producto.resolucion}ppp`;
        if (producto.material) return `Material: ${producto.material}`;
        if (producto.color) return `Color: ${producto.color}`;
        return '';
    };
    
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
                {productosActuales.map((producto) => (
                    <div className="col" key={producto.id}>
                        <div className="card h-100 position-relative">
                            <button 
                                className="btn btn-primary rounded-circle position-absolute end-0 top-0 m-2 btn-cart"
                                style={{ width: '40px', height: '40px', zIndex: 1 }}
                                onClick={() => agregarAlCarrito(producto.id)}
                                disabled={!isOnline}
                            >
                                <i className="bi bi-cart-plus-fill"></i>
                            </button>
                            
                            <div className="ratio ratio-1x1">
                                <img 
                                    src={producto.imagen} 
                                    className="card-img-top producto-imagen object-fit-cover" 
                                    alt={producto.nombre}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setProductoDetalle(producto)}
                                />
                            </div>
                            
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
                ))}
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