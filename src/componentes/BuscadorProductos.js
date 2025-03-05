import React, { useState } from 'react';

const BuscadorProductos = ({ 
    searchTerm, 
    buscarProductos, 
    filtroActual, 
    actualizarFiltro,
    resetearFiltros
}) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value);
        actualizarFiltro('precioMin', e.target.value);
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value);
        actualizarFiltro('precioMax', e.target.value);
    };

    const handleFilterTypeClick = (e, filterValue) => {
        e.preventDefault();
        actualizarFiltro('tipo', filterValue);
    };

    const handleSortClick = (e, sortDirection) => {
        e.preventDefault();
        actualizarFiltro('ordenamiento', sortDirection);
    };

    const handleResetFilters = (e) => {
        e.preventDefault();
        setMinPrice("");
        setMaxPrice("");
        resetearFiltros();
    };
    
    const getTituloFiltro = (tipo) => {
        const filtroNombres = {
            'all': 'Todos los productos',
            'libro_Fisico': 'Libros Físicos',
            'libro_Digital': 'Libros Digitales',
            'ereader': 'E-readers',
            'funda': 'Fundas',
            'marcapaginas': 'Marcapáginas'
        };
        
        if (searchTerm) {
            return `Buscando por: ${searchTerm}`;
        }
        
        return filtroNombres[tipo] || 'Todos los productos';
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Título */}
                <h2 id="mainTitle">{getTituloFiltro(filtroActual.tipo)}</h2>
                
                {/* Buscador y filtros */}
                <div className="input-group w-auto">
                    <button 
                        type="button" 
                        className="btn btn-secondary dropdown-toggle" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <i className="bi bi-funnel-fill"></i> Filtrar
                    </button>
                    <ul className="dropdown-menu">
                        <li className="px-3" id="filterContainer">
                            <a className="dropdown-item" href="#" onClick={(e) => handleFilterTypeClick(e, 'all')}>Todos</a>
                            <a className="dropdown-item" href="#" onClick={(e) => handleFilterTypeClick(e, 'libro_Fisico')}>Libros Físicos</a>
                            <a className="dropdown-item" href="#" onClick={(e) => handleFilterTypeClick(e, 'libro_Digital')}>Libros Digitales</a>
                            <a className="dropdown-item" href="#" onClick={(e) => handleFilterTypeClick(e, 'ereader')}>Ereaders</a>
                            <a className="dropdown-item" href="#" onClick={(e) => handleFilterTypeClick(e, 'funda')}>Fundas Ereader</a>
                            <a className="dropdown-item" href="#" onClick={(e) => handleFilterTypeClick(e, 'marcapaginas')}>Marcapáginas</a>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="px-3" id="priceRangeContainer">
                            <label htmlFor="priceRangeMin" className="form-label text-light">Rango de precios:</label>
                            <div className="price-inputs d-flex gap-2 mt-2">
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">€</span>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="minPrice" 
                                        placeholder="Min" 
                                        min="0"
                                        value={minPrice}
                                        onChange={handleMinPriceChange}
                                    />
                                </div>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text">€</span>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="maxPrice" 
                                        placeholder="Max" 
                                        min="0"
                                        value={maxPrice}
                                        onChange={handleMaxPriceChange}
                                    />
                                </div>
                            </div>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="px-3" id="sortContainer">
                            <div className="btn-group btn-group-sm w-100">
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={(e) => handleSortClick(e, 'asc')}
                                >
                                    <i className="bi bi-sort-numeric-down"></i> Menor precio
                                </button>
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={(e) => handleSortClick(e, 'desc')}
                                >
                                    <i className="bi bi-sort-numeric-up"></i> Mayor precio
                                </button>
                            </div>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li className="px-3">
                            <button 
                                className="btn btn-outline-secondary" 
                                id="resetFilters"
                                onClick={handleResetFilters}
                            >
                                <i className="bi bi-arrow-counterclockwise"></i> Restablecer
                            </button>
                        </li>
                    </ul>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="searchInput" 
                        placeholder="Buscar productos..." 
                        value={searchTerm}
                        onChange={(e) => buscarProductos(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default BuscadorProductos;