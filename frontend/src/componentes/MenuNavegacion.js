import React from 'react';

const MenuNavegacion = ({ carritoCount, toggleCarrito, isOnline, usuario, seccionActual, cambiarSeccion }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <button 
                                className={`nav-link btn btn-link ${seccionActual === 'escaparate' ? 'active' : ''}`}
                                onClick={() => cambiarSeccion('escaparate')}
                            >
                                Inicio
                            </button>
                        </li>
                        
                        {/* Solo mostrar Mi Cuenta si hay usuario autenticado */}
                        {usuario && (
                            <li className="nav-item">
                                <button 
                                    className={`nav-link btn btn-link ${seccionActual === 'mi-cuenta' ? 'active' : ''}`}
                                    onClick={() => cambiarSeccion('mi-cuenta')}
                                >
                                    Mi Cuenta
                                </button>
                            </li>
                        )}
                        
                        {/* Solo mostrar Añadir Producto y Editar/Borrar Productos si es administrador */}
                        {usuario && usuario.usuario.rol === 'administrador' && (
                            <>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link btn btn-link ${seccionActual === 'anadir-producto' ? 'active' : ''}`}
                                        onClick={() => cambiarSeccion('anadir-producto')}
                                    >
                                        Añadir Producto
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link btn btn-link ${seccionActual === 'editar-borrar-productos' ? 'active' : ''}`}
                                        onClick={() => cambiarSeccion('editar-borrar-productos')}
                                    >
                                        Editar/Borrar Productos
                                    </button>
                                </li>
                            </>
                        )}
                        
                        <li className="nav-item">
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
            </div>
        </nav>
    );
};

export default MenuNavegacion;