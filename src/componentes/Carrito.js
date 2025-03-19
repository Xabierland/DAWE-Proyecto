import React, { useState, useEffect, useCallback } from 'react';
import { DIVISA, MAX_COPIAS, guardarEnCarrito, borrarDelCarrito, cargarCarrito } from '../tienda/tienda';

const Carrito = ({ setShowCarrito, setCarritoCount, carritoUpdated }) => {
    // Estado para el carrito
    const [carrito, setCarrito] = useState(new Map());
    
    // Memoizar la función updateCarritoCount para evitar recreaciones innecesarias
    const updateCarritoCount = useCallback((carritoActual = carrito) => {
        const count = Array.from(carritoActual.values()).reduce(
            (total, item) => total + item.cantidad, 0
        );
        setCarritoCount(count);
    }, [carrito, setCarritoCount]);
    
    // Cargar carrito desde localStorage al iniciar y cuando cambie carritoUpdated
    useEffect(() => {
        // Usar exclusivamente la función de tienda.js para cargar el carrito
        const itemsCarrito = cargarCarrito();
        
        const carritoMap = new Map();
        if (itemsCarrito.length > 0) {
            itemsCarrito.forEach(item => {
                // Asegurarnos de usar string para la clave del Map
                carritoMap.set(String(item.id), {
                    nombre: item.nombre,
                    precio: item.precio,
                    imagen: item.imagen,
                    cantidad: item.cantidad
                });
            });
        }
        
        setCarrito(carritoMap);
            
        // Actualizar contador de productos en el carrito
        updateCarritoCount(carritoMap);
        
    }, [carritoUpdated, updateCarritoCount]);
    
    // Función para actualizar cantidad de producto
    const actualizarCantidad = (productId, newQuantity) => {
        const productoIdString = String(productId);
        const nuevoCarrito = new Map(carrito);
        
        if (!nuevoCarrito.has(productoIdString)) return;
        
        if (newQuantity <= 0) {
            // Eliminar producto usando la función de tienda.js
            nuevoCarrito.delete(productoIdString);
            borrarDelCarrito(productoIdString);
        } else if (newQuantity > MAX_COPIAS) {
            console.log(`Máximo de copias alcanzado (${MAX_COPIAS})`);
            return;
        } else {
            // Actualizar cantidad usando la función de tienda.js
            const item = nuevoCarrito.get(productoIdString);
            item.cantidad = newQuantity;
            nuevoCarrito.set(productoIdString, item);
            guardarEnCarrito(productoIdString, item);
        }
        
        setCarrito(nuevoCarrito);
        updateCarritoCount(nuevoCarrito);
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
        <div className="offcanvas offcanvas-start show" tabIndex="-1" id="cartOffcanvas">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Carrito de Compra</h5>
                <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowCarrito(false)}
                ></button>
            </div>
            <div className="offcanvas-body">
                <div id="cartItems" className="mb-3">
                    {Array.from(carrito.entries()).map(([productId, item]) => (
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
                                            value={item.cantidad}
                                            min="0"
                                            max="20"
                                            style={{ width: '70px' }}
                                            onChange={(e) => actualizarCantidad(productId, parseInt(e.target.value))}
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
                        </div>
                    ))}
                    
                    {carrito.size === 0 && (
                        <div className="text-center py-4">
                            <p className="mb-0 text-muted">El carrito está vacío</p>
                        </div>
                    )}
                </div>
                <div className="cart-total border-top pt-3">
                    <h6>Total: <span id="cartTotal">{calcularTotal()}</span>{DIVISA}</h6>
                </div>
            </div>
        </div>
    );
};

export default Carrito;