import React, { useEffect } from 'react';

const DetallesProducto = ({ producto, onClose }) => {
    // Impedir scroll en el body cuando se muestra el modal
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);
    
    // Función para obtener campos extra según el tipo de producto
    const getExtraField = (producto) => {
        if (producto.isbn) return `ISBN: ${producto.isbn}`;
        if (producto.tamano) return `Tamaño: ${producto.tamano}KiB`;
        if (producto.resolucion) return `Resolución: ${producto.resolucion}ppp`;
        if (producto.material) return `Material: ${producto.material}`;
        if (producto.color) return `Color: ${producto.color}`;
        return '';
    };
    
    // Si no hay producto, no mostrar nada
    if (!producto) return null;
    
    return (
        <>
            <div 
                className="modal-overlay"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1050,
                }}
                onClick={onClose}
            ></div>
            
            <div 
                className="modal-producto card bg-dark text-light"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '2rem',
                    borderRadius: '8px',
                    zIndex: 1051,
                    width: '90%',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.125)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="row h-100">
                    <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
                        <img 
                            src={producto.imagen} 
                            alt={producto.nombre} 
                            className="img-fluid rounded"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                    <div 
                        className="col-md-6 producto-detalles" 
                        style={{
                            maxHeight: '70vh',
                            overflowY: 'auto',
                        }}
                    >
                        <button 
                            type="button" 
                            className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                            onClick={onClose}
                        ></button>
                        
                        <h3 className="display-6 mb-4 text-light">{producto.nombre}</h3>
                        <p className="h4 text-warning">Precio: {producto.precio}€</p>
                        <p className="text-muted">{getExtraField(producto)}</p>
                        <p className="lead">{producto.descripcion}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetallesProducto;