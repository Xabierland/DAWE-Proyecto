import React, { useState, useEffect, useRef } from 'react';
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
    // Eliminamos el estado filePreview que ya no necesitamos
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);
    
    // Estado unificado para mensajes
    const [mensaje, setMensaje] = useState({
        texto: '',
        tipo: '', // 'success', 'danger', 'warning', 'info'
        mostrar: false
    });
    
    const fileTypes = ["JPG", "JPEG", "PNG"];
    
    // Función para mostrar mensajes
    const mostrarMensaje = (texto, tipo = 'danger') => {
        setMensaje({
            texto,
            tipo,
            mostrar: true
        });
        
        // Limpiar todos los mensajes después de 2 segundos
        setTimeout(() => {
            setMensaje(prev => ({...prev, mostrar: false}));
        }, 1500);
    };
    
    // Efecto para actualizar cuando cambia el archivo
    useEffect(() => {
        if (file) {
            // En lugar de usar URL.createObjectURL, usamos FileReader para convertir a base64
            const reader = new FileReader();
            reader.onload = (e) => {
                // La URL base64 persistirá incluso después de recargar la página si la guardamos
                setFormData(prev => ({ ...prev, imagen: e.target.result }));
                
                // Actualizamos el valor del input para mostrar el nombre del archivo
                if (fileInputRef.current) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInputRef.current.files = dataTransfer.files;
                }
            };
            reader.readAsDataURL(file);
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
        if (errorMessage) {
            mostrarMensaje(errorMessage, 'danger');
        }
        setFile(null);
        
        // Limpiar también el valor del input file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (file) => {
        if (Array.isArray(file)) {
            resetFileState('Solo se puede subir un archivo a la vez');
            return;
        }
        
        // Limpiar cualquier mensaje de error previo
        setMensaje(prev => prev.mostrar ? {...prev, mostrar: false} : prev);
        
        setFile(file);
        mostrarMensaje('Imagen seleccionada correctamente', 'success');
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
        // Limpiar cualquier mensaje de error previo
        setMensaje(prev => prev.mostrar ? {...prev, mostrar: false} : prev);
        
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
    
    // Nueva función para eliminar el archivo seleccionado
    const handleRemoveFile = () => {
        resetFileState();
        mostrarMensaje('Imagen eliminada', 'info');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.tipo) {
            mostrarMensaje('Debe seleccionar un tipo de producto', 'warning');
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
            mostrarMensaje('Producto agregado correctamente', 'success');
            
            // Limpiar formulario - Usar React en lugar de manipular el DOM
            setFormData({
                tipo: '', // Resetear el tipo directamente en React
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
            
            // Limpiar el input file usando React
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            // Notificar que se ha añadido un nuevo producto
            if (onProductoAdded) {
                onProductoAdded();
            }
        } else {
            mostrarMensaje('Error al añadir el producto', 'danger');
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
    
    // Función para renderizar el mensaje de estado
    const renderMensaje = () => {
        if (!mensaje.mostrar) return null;
        
        const iconos = {
            'success': 'bi-check-circle-fill',
            'danger': 'bi-exclamation-triangle-fill',
            'warning': 'bi-exclamation-circle-fill',
            'info': 'bi-info-circle-fill'
        };
        
        return (
            <div className={`alert alert-${mensaje.tipo} mt-2 d-flex align-items-center`}>
                <i className={`bi ${iconos[mensaje.tipo]} me-2`}></i>
                <div>{mensaje.texto}</div>
                <button 
                    type="button" 
                    className="btn-close ms-auto" 
                    onClick={() => setMensaje(prev => ({...prev, mostrar: false}))}
                    aria-label="Close"
                ></button>
            </div>
        );
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
                                ref={fileInputRef}
                            />
                            {file && (
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary" 
                                    onClick={handleRemoveFile}
                                    title="Eliminar imagen"
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                        </div>
                        
                        <div 
                            id="dragDropArea" 
                            className={`card p-3 text-center border-dashed ${!isOnline ? 'file-uploader-disabled' : ''}`}
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
                                        <i className={`bi mb-2 ${dragging ? 'bi-file-arrow-down' : (file ? 'bi-check-circle-fill text-success' : 'bi-cloud-upload')}`}></i>
                                        <p className="mb-0" id="dropText">
                                            {dragging ? "Suelta la imagen" : 
                                             !isOnline ? "No tienes conexión" : 
                                             file ? "Archivo seleccionado" : "O arrastre y suelte aquí"}
                                        </p>
                                    </div>
                                }
                            />
                        </div>
                        
                        {/* Sistema unificado de mensajes */}
                        {renderMensaje()}
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