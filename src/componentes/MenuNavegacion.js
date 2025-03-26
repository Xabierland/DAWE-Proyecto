import React from 'react';

const MenuNavegacion = ({ carritoCount, toggleCarrito, isOnline }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        {/* Cambiado de <a> a <button> */}
                        <button className="nav-link btn btn-link" aria-current="page">
                            Inicio
                        </button>
                    </li>
                    <li className="nav-item">
                        {/* Cambiado de <a> a <button> */}
                        <button 
                            className="nav-link btn btn-link" 
                            onClick={toggleCarrito}
                        >
                            Carrito <span className="badge cart-count">{carritoCount}</span>
                        </button>
                    </li>
                </ul>
                
                {/* Indicador de estado sin conexión */}
                {!isOnline && (
                    <div className="ms-auto">
                        <div className="alert alert-danger py-1 px-2 m-0 text-white">
                            Estás offline
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default MenuNavegacion;