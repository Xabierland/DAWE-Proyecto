import React from 'react';

const Carrito = ({ carrito, actualizarCantidad, setShowCarrito }) => {
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
                                    <p className="mb-1">Precio: {item.precio}€</p>
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
                                    <p className="mb-1">Subtotal: {(item.precio * item.cantidad).toFixed(2)}€</p>
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
                    <h6>Total: <span id="cartTotal">{calcularTotal()}</span>€</h6>
                </div>
            </div>
        </div>
    );
};

export default Carrito;