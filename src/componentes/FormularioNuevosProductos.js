import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { DIVISA, agregarNuevoProducto as agregarProductoTienda } from '../tienda/tienda';

const FormularioNuevosProductos = ({ isOnline, onProductoAdded }) => {
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
    const [fileError, setFileError] = useState(null);
    const [fileSucess, setFileSucess] = useState(null);
    
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
        
        // Mapeo correcto de IDs a nombres de campo en español
        const fieldMapping = {
            'productName': 'nombre',
            'productPrice': 'precio',
            'productDescription': 'descripcion',
            'productAutor': 'autor',
            'productIsbn': 'isbn',
            'productPaginas': 'paginas',
            'productTamano': 'tamano',
            'productResolucion': 'resolucion',
            'productMaterial': 'material',
            'productColor': 'color'
        };
        
        // Utilizar el mapeo para obtener el nombre correcto del campo
        const fieldName = fieldMapping[id] || id;
        
        setFormData({ ...formData, [fieldName]: value });
    };

    const resetFileState = (errorMessage = null) => {
        setFileError(errorMessage);
        setFile(null);
        setFilePreview('');
    };

    const handleFileChange = (file) => {
        if (Array.isArray(file)) {
            resetFileState('Solo se puede subir un archivo a la vez');
            return;
        }
        resetFileState();
        setFile(file);
    };

    const handleTypeError = () => {
        resetFileState('Solo se permiten archivos PNG, JPG o JPEG');
    };

    const handleDrop = (files) => {
        if (files.length > 1) {
            resetFileState('Solo se puede subir un archivo a la vez');
            return false;
        }
        return true;
    };

    const handleInputFileChange = (e) => {
        resetFileState();
        if (e.target.files && e.target.files.length > 1) {
            resetFileState('Solo se puede subir un archivo a la vez');
            e.target.value = '';
            return;
        }

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type.split('/')[1].toUpperCase();
            if (!fileTypes.includes(fileType)) {
                handleTypeError(); // Reutilizamos la lógica de error de tipo
                e.target.value = '';
                return;
            }
            handleFileChange(selectedFile);
        }
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
            imagen: formData.imagen || '/img/productos/default.png'
        };
        
        // Añadir campos específicos según el tipo
        switch (formData.tipo) {
            case 'libro_Fisico':
                datos.autor = formData.autor;
                datos.isbn = formData.isbn;
                datos.paginas = parseInt(formData.paginas);
                break;
            case 'libro_Digital':
                datos.autor = formData.autor;
                datos.isbn = formData.isbn;
                datos.paginas = parseInt(formData.paginas);
                datos.tamano = parseInt(formData.tamano);
                break;
            case 'ereader':
                datos.resolucion = parseInt(formData.resolucion);
                break;
            case 'funda':
                datos.material = formData.material;
                break;
            case 'marcapaginas':
                datos.color = formData.color;
                break;
            default:
                break;
        }
        
        // Llamar a la función para agregar producto pasando tipo y datos
        const resultado = agregarProductoTienda(formData.tipo, datos);
        
        if (resultado) {
            // Mostrar mensaje de éxito
            setFileSucess(true);
            
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
            
            // Notificar que se ha añadido un nuevo producto
            if (onProductoAdded) {
                onProductoAdded();
            }
        } else {
            alert('Error al añadir el producto');
        }
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
                            <span className="input-group-text">{DIVISA}</span>
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
                        
                        <div className="input-group mb-2">
                            <input 
                                type="file" 
                                className="form-control" 
                                id="fileInput"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleInputFileChange}
                                disabled={!isOnline}
                            />
                        </div>
                        
                        <div 
                            id="dragDropArea" 
                            className={`card p-3 text-center border-dashed ${dragging ? 'hover' : ''} ${!isOnline ? 'file-uploader-disabled' : ''}`}
                        >
                            <FileUploader 
                                handleChange={handleFileChange}
                                name="file"
                                types={fileTypes}
                                disabled={!isOnline}
                                hoverTitle=' '
                                onDraggingStateChange={(dragging) => setDragging(dragging)}
                                onTypeError={handleTypeError}
                                onDrop={handleDrop} // Usamos onDrop para manejar múltiples archivos
                                dropMessageStyle={{ 
                                    display: dragging ? 'block' : 'none',
                                    background: 'transparent',
                                    color: 'inherit',
                                    fontSize: 'inherit',
                                    fontWeight: 'inherit'
                                }}
                                children={
                                    <div style={{backgroundColor: !isOnline ? "var(--bs-secondary-bg)" : "transparent"}}> 
                                        <i className={`bi mb-2 ${!isOnline ? 'bi-exclamation-circle-fill text-danger' : 'bi-cloud-upload'}`}></i>
                                        {isOnline ? (
                                            dragging ? (
                                                <p className="mb-0" id="dropText">Suelta la imagen</p>
                                            ) : (
                                                <p className="mb-0" id="dropText">O arrastre y suelte aquí</p>
                                            )
                                        ) : (
                                            <p className="mb-0 text-danger" id="dropText">No tienes conexión</p>
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
                        
                        {fileError && (
                            <div className="alert alert-danger mt-2">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {fileError}
                            </div>
                        )}
                        {fileSucess && (
                            <div className="alert alert-success mt-2">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Archivo subido correctamente
                            </div>
                        )

                        }
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={!isOnline} // Eliminamos la condición de fileError para no bloquear el botón
                    >
                        Subir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioNuevosProductos;