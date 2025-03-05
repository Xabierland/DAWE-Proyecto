import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Libro, Ebook, Ereader, Funda, Marcapaginas } from '../tienda/productos';

const FormularioNuevosProductos = ({ agregarNuevoProducto, isOnline }) => {
    const [formData, setFormData] = useState({
        tipo: '',
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: null,
        // Campos opcionales según tipo
        autor: '',
        isbn: '',
        paginas: '',
        tamano: '',
        resolucion: '',
        material: '',
        color: ''
    });
    
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');
    const [dragging, setDragging] = useState(false);
    
    const fileTypes = ["JPG", "JPEG", "PNG"];
    
    // Efecto para actualizar vista previa del archivo
    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setFilePreview(objectUrl);
            setFormData(prev => ({ ...prev, imagen: objectUrl }));
            
            // Limpiar URL al desmontar
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id.replace('product', '').toLowerCase()]: value });
    };
    
    const handleFileChange = (file) => {
        setFile(file);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.tipo) {
            alert('Debe seleccionar un tipo de producto');
            return;
        }
        
        // Valores comunes para todos los tipos
        const datos = {
            nombre: formData.nombre,
            precio: parseFloat(formData.precio),
            descripcion: formData.descripcion || '',
            imagen: formData.imagen || '/img/default.png'
        };
        
        // Crear producto según el tipo
        let nuevoProducto;
        
        switch (formData.tipo) {
            case 'libro_Fisico':
                nuevoProducto = new Libro(
                    datos.nombre,
                    datos.precio,
                    datos.descripcion,
                    formData.autor,
                    formData.isbn,
                    parseInt(formData.paginas),
                    datos.imagen
                );
                break;
            case 'libro_Digital':
                nuevoProducto = new Ebook(
                    datos.nombre,
                    datos.precio,
                    datos.descripcion,
                    formData.autor,
                    formData.isbn,
                    parseInt(formData.paginas),
                    parseInt(formData.tamano),
                    datos.imagen
                );
                break;
            case 'ereader':
                nuevoProducto = new Ereader(
                    datos.nombre,
                    datos.precio,
                    datos.descripcion,
                    parseInt(formData.resolucion),
                    datos.imagen
                );
                break;
            case 'funda':
                nuevoProducto = new Funda(
                    datos.nombre,
                    datos.precio,
                    datos.descripcion,
                    formData.material,
                    datos.imagen
                );
                break;
            case 'marcapaginas':
                nuevoProducto = new Marcapaginas(
                    datos.nombre,
                    datos.precio,
                    datos.descripcion,
                    formData.color,
                    datos.imagen
                );
                break;
            default:
                alert('Tipo de producto no válido');
                return;
        }
        
        agregarNuevoProducto(nuevoProducto);
        
        // Mostrar mensaje de éxito
        alert('Producto añadido correctamente');
        
        // Limpiar formulario
        setFormData({
            tipo: '',
            nombre: '',
            precio: '',
            descripcion: '',
            imagen: null,
            autor: '',
            isbn: '',
            paginas: '',
            tamano: '',
            resolucion: '',
            material: '',
            color: ''
        });
        setFile(null);
        setFilePreview('');
        
        // Reset del dropdown de tipo
        document.getElementById('productType').selectedIndex = 0;
    };
    
    // Renderizar campos adicionales según el tipo seleccionado
    const renderCamposExtra = () => {
        switch (formData.tipo) {
            case 'libro_Fisico':
                return (
                    <>
                        <div className="mb-3">
                            <label htmlFor="productAutor" className="form-label">Autor:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="productAutor" 
                                placeholder="Ej: J.R.R. Tolkien" 
                                required
                                value={formData.autor}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productIsbn" className="form-label">ISBN:</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="productIsbn" 
                                placeholder="Ej: 9788445077566" 
                                required
                                value={formData.isbn}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPaginas" className="form-label">Número de páginas:</label>
                            <input 
                                type="number" 
                                min="1" 
                                className="form-control" 
                                id="productPaginas" 
                                placeholder="Ej: 392" 
                                required
                                value={formData.paginas}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                    </>
                );
            case 'libro_Digital':
                return (
                    <>
                        <div className="mb-3">
                            <label htmlFor="productAutor" className="form-label">Autor:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="productAutor" 
                                placeholder="Ej: George R.R. Martin" 
                                required
                                value={formData.autor}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productIsbn" className="form-label">ISBN:</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="productIsbn" 
                                placeholder="Ej: 9788401032141" 
                                required
                                value={formData.isbn}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productPaginas" className="form-label">Número de páginas:</label>
                            <input 
                                type="number" 
                                min="1" 
                                className="form-control" 
                                id="productPaginas" 
                                placeholder="Ej: 842" 
                                required
                                value={formData.paginas}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="productTamano" className="form-label">Tamaño (KiB):</label>
                            <input 
                                type="number" 
                                min="0" 
                                className="form-control" 
                                id="productTamano" 
                                placeholder="Ej: 2048" 
                                required
                                value={formData.tamano}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                    </>
                );
            case 'ereader':
                return (
                    <div className="mb-3">
                        <label htmlFor="productResolucion" className="form-label">Resolución:</label>
                        <input 
                            type="number" 
                            min="1" 
                            className="form-control" 
                            id="productResolucion" 
                            placeholder="Ej: 300 PPP" 
                            required
                            value={formData.resolucion}
                            onChange={handleChange}
                            disabled={!isOnline}
                        />
                    </div>
                );
            case 'funda':
                return (
                    <div className="mb-3">
                        <label htmlFor="productMaterial" className="form-label">Material:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="productMaterial" 
                            placeholder="Ej: Cuero, Silicona, Tela" 
                            required
                            value={formData.material}
                            onChange={handleChange}
                            disabled={!isOnline}
                        />
                    </div>
                );
            case 'marcapaginas':
                return (
                    <div className="mb-3">
                        <label htmlFor="productColor" className="form-label">Color:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="productColor" 
                            placeholder="Ej: Rojo, Azul marino, Verde esmeralda" 
                            required
                            value={formData.color}
                            onChange={handleChange}
                            disabled={!isOnline}
                        />
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title h5 mb-0">Añadir Producto</h2>
            </div>
            <div className="card-body">
                <form id="productForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="productType" className="form-label">Tipo de producto:</label>
                        <select 
                            className="form-select" 
                            id="productType" 
                            required
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            disabled={!isOnline}
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="libro_Fisico">Libro Físico</option>
                            <option value="libro_Digital">Libro Digital</option>
                            <option value="ereader">Ereader</option>
                            <option value="funda">Funda Ereader</option>
                            <option value="marcapaginas">Marcapaginas</option>
                        </select>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="productName" className="form-label">Nombre del producto:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="productName" 
                            placeholder="Ej: Nombre del producto" 
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={!isOnline}
                        />
                    </div>
                    
                    <div id="optionalInput">
                        {renderCamposExtra()}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="productPrice" className="form-label">Precio:</label>
                        <div className="input-group">
                            <span className="input-group-text">€</span>
                            <input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                className="form-control" 
                                id="productPrice" 
                                placeholder="Ej: 0.00" 
                                required
                                value={formData.precio}
                                onChange={handleChange}
                                disabled={!isOnline}
                            />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="productDescription" className="form-label">Descripción:</label>
                        <textarea 
                            className="form-control" 
                            id="productDescription" 
                            rows="3" 
                            placeholder="Describe el producto detalladamente..."
                            value={formData.descripcion}
                            onChange={handleChange}
                            disabled={!isOnline}
                        ></textarea>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Subir imagen:</label>
                        <div 
                            id="dragDropArea" 
                            className={`card p-3 text-center border-dashed ${dragging ? 'hover' : ''} ${!isOnline ? 'bg-light' : ''}`}
                        >
                            <FileUploader 
                                handleChange={handleFileChange}
                                name="file"
                                types={fileTypes}
                                disabled={!isOnline}
                                onDraggingStateChange={(dragging) => setDragging(dragging)}
                                dropMessageStyle={{ 
                                    display: dragging ? 'block' : 'none',
                                    background: 'transparent',
                                    color: 'inherit',
                                    fontSize: 'inherit',
                                    fontWeight: 'inherit'
                                }}
                                // Busca cualquier prop como ésta:
                                children={
                                    <div>
                                        <i className="bi bi-cloud-upload mb-2"></i>
                                        {dragging ? (
                                            <p className="mb-0" id="dropText">Suelta la imagen</p>
                                        ) : (
                                            <p className="mb-0" id="dropText">Arrastre y suelte aquí</p>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                        {filePreview && (
                            <div className="mt-2 text-center">
                                <img 
                                    src={filePreview} 
                                    alt="Vista previa" 
                                    style={{ maxHeight: '100px' }} 
                                    className="img-fluid"
                                />
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={!isOnline}
                    >
                        Subir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioNuevosProductos;