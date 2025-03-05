import React from 'react';
import BuscadorProductos from './BuscadorProductos';
import Paginacion from './Paginacion';
import DetallesProducto from './DetallesProducto';

const EscaparateProductos = ({
    productos,
    currentPage,
    productosPerPage,
    cambiarPagina,
    agregarAlCarrito,
    setProductoDetalle,
    productoDetalle,
    filtroActual,
    actualizarFiltro,
    resetearFiltros,
    buscarProductos,
    searchTerm
}) => {
    // Obtener los productos de la página actual
    const indexOfLastProducto = currentPage * productosPerPage;
    const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
    const productosActuales = productos.slice(indexOfFirstProducto, indexOfLastProducto);
    
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
                                <p className="card-text"><strong>Precio: </strong>{producto.precio}€</p>
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
                totalProductos={productos.length}
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