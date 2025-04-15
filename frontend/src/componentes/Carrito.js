import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DIVISA, MAX_COPIAS, guardarEnCarrito, borrarDelCarrito, cargarCarrito, cargarProductos } from '../tienda/tienda';

const Carrito = ({ setShowCarritoProp, setCarritoCountProp, carritoUpdatedProp, carrito, setCarrito}) => {
    // Estado para manejar los mensajes de error de cantidad máxima
    const [maxCantidadError, setMaxCantidadError] = useState({});
    
    // Estado local para manejar los valores del input durante la edición
    const [inputValues, setInputValues] = useState({});
    
    // Estado para manejar errores de carga
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    
    // Referencia al elemento del carrito para detectar clics fuera
    const carritoRef = useRef(null);
    
    // Memorizar la función con useCallback para evitar recreaciones
    const updateCarritoCount = useCallback((carritoActual) => {
        const count = Array.from(carritoActual.values()).reduce(
            (total, item) => total + item.cantidad, 0
        );
        setCarritoCountProp(count);
        console.log(`Contador de carrito actualizado: ${count} items`);
    }, [setCarritoCountProp]);
    
    // Efecto para cargar el carrito cuando cambia carritoUpdatedProp
    useEffect(() => {
        // Este efecto SOLO debe ejecutarse cuando carritoUpdatedProp cambia
        const actualizarCarrito = async () => {
            try {
                console.log('Actualizando carrito desde localStorage...');
                setCargando(true);
                // Asegurar que tenemos los productos cargados para referencias correctas
                await cargarProductos();
                
                const carritoMap = cargarCarrito();
                console.log('Carrito cargado desde localStorage:', carritoMap);
                setCarrito(carritoMap);
                updateCarritoCount(carritoMap);
                
                // Inicializar los valores de input con las cantidades del carrito
                const initialInputValues = {};
                carritoMap.forEach((item, id) => {
                    initialInputValues[id] = item.cantidad.toString();
                });
                setInputValues(initialInputValues);
                setError(null);
            } catch (err) {
                console.error('Error al cargar el carrito:', err);
                setError('Error al cargar el carrito. Por favor, intenta nuevamente.');
            } finally {
                setCargando(false);
            }
        };
        
        actualizarCarrito();
    }, [carritoUpdatedProp, setCarrito, updateCarritoCount]);
    
    // Cuando se muestra el carrito se notifica a App.js que no se pueda hacer scroll
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Notificar a App.js que el carrito está abierto
            const event = new CustomEvent('carritoState', { detail: { isOpen: true } });
            window.dispatchEvent(event);
        }
        
        return () => {
            if (typeof window !== 'undefined') {
                // Notificar a App.js que el carrito está cerrado
                const event = new CustomEvent('carritoState', { detail: { isOpen: false } });
                window.dispatchEvent(event);
            }
        };
    }, []);
    
    // Función para actualizar cantidad de producto
    const actualizarCantidad = (productId, newQuantity) => {
        console.log(`Actualizando cantidad de producto ${productId} a ${newQuantity}`);
        const productoIdString = String(productId);
        const nuevoCarrito = new Map(carrito);
        
        if (!nuevoCarrito.has(productoIdString)) {
            console.log(`El producto ${productoIdString} no está en el carrito`);
            return;
        }
        
        if (newQuantity <= 0) {
            // Eliminar producto usando la función de tienda.js
            console.log(`Eliminando producto ${productoIdString} del carrito`);
            nuevoCarrito.delete(productoIdString);
            borrarDelCarrito(productoIdString);
            
            // Eliminar también del estado de inputs
            setInputValues(prev => {
                const newInputs = {...prev};
                delete newInputs[productoIdString];
                return newInputs;
            });
        } else if (newQuantity > MAX_COPIAS) {
            // Mostrar mensaje de error y ajustar al máximo
            console.log(`Cantidad ${newQuantity} excede el máximo permitido (${MAX_COPIAS})`);
            setMaxCantidadError(prev => ({ ...prev, [productoIdString]: true }));
            
            // Actualizar el valor del input al máximo permitido
            setInputValues(prev => ({
                ...prev,
                [productoIdString]: MAX_COPIAS.toString()
            }));
            
            // Actualizar también el carrito real con MAX_COPIAS
            const item = nuevoCarrito.get(productoIdString);
            if (item) {
                const nuevoItem = {...item, cantidad: MAX_COPIAS};
                nuevoCarrito.set(productoIdString, nuevoItem);
                guardarEnCarrito(productoIdString, nuevoItem);
            }
            
            // Ocultar el mensaje de error después de 1.5 segundos
            setTimeout(() => {
                setMaxCantidadError(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[productoIdString];
                    return newErrors;
                });
            }, 1500);
        } else {
            // Actualizar cantidad usando la función de tienda.js
            console.log(`Actualizando cantidad de ${productoIdString} a ${newQuantity}`);
            const item = nuevoCarrito.get(productoIdString);
            item.cantidad = newQuantity;
            nuevoCarrito.set(productoIdString, item);
            guardarEnCarrito(productoIdString, item);
            
            // Actualizar también el valor del input
            setInputValues(prev => ({
                ...prev,
                [productoIdString]: newQuantity.toString()
            }));
        }
        
        setCarrito(nuevoCarrito);
        updateCarritoCount(nuevoCarrito);
    };
    
    // Función para manejar cambios en los inputs
    const handleInputChange = (productId, value) => {
        // Actualizar siempre el valor del input para permitir la edición
        setInputValues(prev => ({
            ...prev,
            [productId]: value
        }));
        
        // Procesar el valor numérico si existe
        const parsedValue = parseInt(value);
        
        // Si es un número válido, realizar acciones inmediatas
        if (!isNaN(parsedValue)) {
            if (parsedValue <= 0) {
                // Si el valor es 0 o negativo, eliminar el producto inmediatamente
                actualizarCantidad(productId, 0);
            } else if (parsedValue > MAX_COPIAS) {
                // Si excede el máximo, mostrar mensaje y ajustar
                setMaxCantidadError(prev => ({ ...prev, [productId]: true }));
                
                // Ajustar el valor después de un breve delay para permitir ver primero el error
                setTimeout(() => {
                    actualizarCantidad(productId, MAX_COPIAS+1);
                }, 100);
            } else {
                // Si es un valor válido en el rango permitido, actualizar carrito
                actualizarCantidad(productId, parsedValue);
            }
        }
    };
    
    // Función para manejar cuando el input pierde el foco
    const handleInputBlur = (productId) => {
        const value = inputValues[productId] || '';
        const parsedValue = parseInt(value);
        
        if (value === '' || isNaN(parsedValue)) {
            // Si está vacío o no es un número, eliminar el producto
            actualizarCantidad(productId, 0);
        } else if (parsedValue > MAX_COPIAS) {
            // Si excede el máximo, ajustar al máximo
            actualizarCantidad(productId, MAX_COPIAS);
        } else if (parsedValue <= 0) {
            // Si es 0 o negativo, eliminar el producto
            actualizarCantidad(productId, 0);
        } else {
            // Si es un valor válido, actualizar el carrito
            actualizarCantidad(productId, parsedValue);
        }
    };
    
    // Calcular el total del carrito
    const calcularTotal = () => {
        let total = 0;
        carrito.forEach((item) => {
            total += item.precio * item.cantidad;
        });
        return total.toFixed(2);
    };
    
    return (
        <>
            {/* Overlay oscuro para el fondo */}
            <div 
                className="modal-overlay"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1040,
                }}
                onClick={() => setShowCarritoProp(false)}
            ></div>
            
            {/* Contenido del carrito */}
            <div 
                className="offcanvas offcanvas-start show" 
                tabIndex="-1" 
                id="cartOffcanvas" 
                ref={carritoRef}
                style={{ zIndex: 1050 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Carrito de Compra</h5>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowCarritoProp(false)}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {cargando ? (
                        <div className="text-center py-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando carrito...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            <p className="mb-0">{error}</p>
                            <button 
                                className="btn btn-sm btn-outline-danger mt-2"
                                onClick={() => window.location.reload()}
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <div id="cartItems" className="mb-3">
                            {carrito.size > 0 ? (
                                Array.from(carrito.entries()).map(([productId, item]) => (
                                    <div className="cart-item mb-3 border-bottom pb-3" key={productId}>
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={item.imagen} 
                                                alt={item.nombre} 
                                                className="cart-item-image me-3" 
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                            <div className="cart-item-details flex-grow-1">
                                                <h6 className="mb-1">{item.nombre}</h6>
                                                <p className="mb-1">Precio: {item.precio}{DIVISA}</p>
                                                <div className="d-flex align-items-center mb-1">
                                                    <label className="me-2">Cantidad:</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control form-control-sm product-quantity" 
                                                        value={inputValues[productId] || ''}
                                                        min="0"
                                                        max={MAX_COPIAS+1}
                                                        style={{ width: '70px' }}
                                                        onChange={(e) => handleInputChange(productId, e.target.value)}
                                                        onBlur={() => handleInputBlur(productId)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.target.blur(); // Quitar el foco para activar onBlur
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <p className="mb-1">Subtotal: {(item.precio * item.cantidad).toFixed(2)}{DIVISA}</p>
                                            </div>
                                            <button 
                                                className="btn btn-danger btn-sm remove-item" 
                                                title="Eliminar producto"
                                                onClick={() => actualizarCantidad(productId, 0)}
                                            >
                                                x
                                            </button>
                                        </div>
                                        
                                        {/* Mensaje de error por exceder el máximo - Ahora fuera del flex container y en rojo */}
                                        {maxCantidadError[productId] && (
                                            <div className="alert alert-danger py-1 px-2 mt-2 mb-0">
                                                <small><strong>Error:</strong> Máximo de copias alcanzado ({MAX_COPIAS})</small>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <i className="bi bi-cart-x" style={{ fontSize: '48px', opacity: 0.5 }}></i>
                                    <p className="mb-0 text-muted mt-2">El carrito está vacío</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!cargando && !error && carrito.size > 0 && (
                        <div className="cart-total border-top pt-3">
                            <h6>Total: <span id="cartTotal">{calcularTotal()}</span>{DIVISA}</h6>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Carrito;