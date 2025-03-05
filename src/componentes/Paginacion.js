import React from 'react';

const Paginacion = ({ 
    totalProductos, 
    productosActuales, 
    currentPage, 
    productosPerPage, 
    cambiarPagina 
}) => {
    const totalPages = Math.ceil(totalProductos / productosPerPage);
    
    // Si no hay productos, no mostrar paginación
    if (totalProductos === 0) {
        return (
            <nav>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-2">No hay productos que mostrar</p>
                </div>
            </nav>
        );
    }
    
    return (
        <nav>
            <div className="d-flex justify-content-between align-items-center">
                <p className="mb-2">
                    Mostrando {productosActuales.length} de {totalProductos} productos
                </p>
            </div>
            <ul className="pagination justify-content-center">
                {currentPage > 1 && (
                    <li className="page-item">
                        <a 
                            className="page-link" 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                cambiarPagina(currentPage - 1);
                            }}
                        >
                            Anterior
                        </a>
                    </li>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li 
                        key={page} 
                        className={`page-item ${page === currentPage ? 'active' : ''}`}
                    >
                        <a 
                            className="page-link" 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                cambiarPagina(page);
                            }}
                        >
                            {page}
                        </a>
                    </li>
                ))}
                
                {currentPage < totalPages && (
                    <li className="page-item">
                        <a 
                            className="page-link" 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                cambiarPagina(currentPage + 1);
                            }}
                        >
                            Siguiente
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Paginacion;