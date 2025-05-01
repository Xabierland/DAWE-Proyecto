import React, { useState, useEffect } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { DIVISA } from '../tienda/tienda';

const EditarBorrarProductos = ({ onProductoUpdated, isOnline, apiBaseUrl }) => {
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  
  const fileTypes = ["JPG", "JPEG", "PNG"];
  
  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);
  
  // Cargar productos desde la API
  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/productos`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      //console.error('Error:', error);
      mostrarMensaje('Error al cargar productos', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  // Mostrar mensaje temporal
  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };
  
  // Manejar cambio en checkboxes de selección
  const handleSeleccionChange = (e, productoId) => {
    if (e.target.checked) {
      setProductosSeleccionados([...productosSeleccionados, productoId]);
    } else {
      setProductosSeleccionados(productosSeleccionados.filter(id => id !== productoId));
    }
  };
  
  // Manejar borrado de productos seleccionados
  const handleBorrarSeleccionados = async () => {
    if (productosSeleccionados.length === 0) {
      mostrarMensaje('No hay productos seleccionados', 'warning');
      return;
    }
    
    if (!window.confirm(`¿Estás seguro de que deseas borrar ${productosSeleccionados.length} producto(s)?`)) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/productos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids: productosSeleccionados }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al borrar productos');
      }
      
      const data = await response.json();
      mostrarMensaje(`${data.eliminados} producto(s) eliminado(s) correctamente`);
      setProductosSeleccionados([]);
      cargarProductos();
      
      // Notificar al componente padre para actualizar la lista de productos
      if (onProductoUpdated) {
        onProductoUpdated();
      }
    } catch (error) {
      //console.error('Error:', error);
      mostrarMensaje(error.message || 'Error al borrar productos', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  // Abrir formulario de edición
  const handleEditar = (producto) => {
    // Si ya se está editando este producto, cerrar la edición
    if (productoEditando === producto.id) {
      setProductoEditando(null);
      setFormData({});
      setFile(null);
      return;
    }
    
    // Preparar formulario con datos del producto
    setFormData({
      tipo: producto.tipo,
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      autor: producto.autor || '',
      isbn: producto.isbn || '',
      paginas: producto.paginas || '',
      tamano: producto.tamano || '',
      resolucion: producto.resolucion || '',
      material: producto.material || '',
      color: producto.color || ''
    });
    
    setProductoEditando(producto.id);
  };
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar cambio de archivo de imagen
  const handleFileChange = (file) => {
    setFile(file);
    
    // Leer el archivo como base64
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        imagen: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Manejar error de tipo de archivo
  const handleTypeError = () => {
    mostrarMensaje('Solo se permiten archivos PNG, JPG o JPEG', 'danger');
  };
  
  // Enviar formulario de edición
  const handleSubmitEdicion = async (e, productoId) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.precio) {
      mostrarMensaje('Nombre y precio son obligatorios', 'danger');
      return;
    }
    
    try {
      setLoading(true);
      
      const datosAEnviar = {
        tipo: formData.tipo,
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion || '',
      };
      
      // Incluir imagen solo si se ha cambiado
      if (file) {
        datosAEnviar.imagen = formData.imagen;
      }
      
      // Añadir campos específicos según el tipo
      switch (formData.tipo) {
        case 'libro_Fisico':
          datosAEnviar.autor = formData.autor;
          datosAEnviar.isbn = formData.isbn;
          datosAEnviar.paginas = parseInt(formData.paginas);
          break;
        case 'libro_Digital':
          datosAEnviar.autor = formData.autor;
          datosAEnviar.isbn = formData.isbn;
          datosAEnviar.paginas = parseInt(formData.paginas);
          datosAEnviar.tamano = parseInt(formData.tamano);
          break;
        case 'ereader':
          datosAEnviar.resolucion = parseInt(formData.resolucion);
          break;
        case 'funda':
          datosAEnviar.material = formData.material;
          break;
        case 'marcapaginas':
          datosAEnviar.color = formData.color;
          break;
        default:
          break;
      }
      
      const response = await fetch(`${apiBaseUrl}/productos/${productoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(datosAEnviar),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar producto');
      }
      
      mostrarMensaje('Producto actualizado correctamente');
      setProductoEditando(null);
      cargarProductos();
      
      // Notificar al componente padre para actualizar la lista de productos
      if (onProductoUpdated) {
        onProductoUpdated();
      }
    } catch (error) {
      //console.error('Error:', error);
      mostrarMensaje(error.message || 'Error al actualizar producto', 'danger');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar campos adicionales según el tipo de producto
  const renderCamposExtra = () => {
    switch (formData.tipo) {
      case 'libro_Fisico':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="autor" className="form-label">Autor:</label>
              <input
                type="text"
                className="form-control"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="isbn" className="form-label">ISBN:</label>
              <input
                type="text"
                className="form-control"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="paginas" className="form-label">Número de páginas:</label>
              <input
                type="number"
                className="form-control"
                id="paginas"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 'libro_Digital':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="autor" className="form-label">Autor:</label>
              <input
                type="text"
                className="form-control"
                id="autor"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="isbn" className="form-label">ISBN:</label>
              <input
                type="text"
                className="form-control"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="paginas" className="form-label">Número de páginas:</label>
              <input
                type="number"
                className="form-control"
                id="paginas"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tamano" className="form-label">Tamaño (KiB):</label>
              <input
                type="number"
                className="form-control"
                id="tamano"
                name="tamano"
                value={formData.tamano}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 'ereader':
        return (
          <div className="mb-3">
            <label htmlFor="resolucion" className="form-label">Resolución:</label>
            <input
              type="number"
              className="form-control"
              id="resolucion"
              name="resolucion"
              value={formData.resolucion}
              onChange={handleChange}
              required
            />
          </div>
        );
      case 'funda':
        return (
          <div className="mb-3">
            <label htmlFor="material" className="form-label">Material:</label>
            <input
              type="text"
              className="form-control"
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
            />
          </div>
        );
      case 'marcapaginas':
        return (
          <div className="mb-3">
            <label htmlFor="color" className="form-label">Color:</label>
            <input
              type="text"
              className="form-control"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="card-title h5 mb-0">Editar/Borrar Productos</h2>
        <button
          className="btn btn-danger"
          onClick={handleBorrarSeleccionados}
          disabled={productosSeleccionados.length === 0 || loading || !isOnline}
        >
          Borrar Seleccionados ({productosSeleccionados.length})
        </button>
      </div>
      <div className="card-body">
        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`} role="alert">
            {mensaje.texto}
          </div>
        )}
        
        {loading && !productos.length ? (
          <div className="text-center p-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando productos...</p>
          </div>
        ) : (
          <>
            {productos.length === 0 ? (
              <p className="text-center">No hay productos disponibles</p>
            ) : (
              <div className="list-group">
                {productos.map((producto) => (
                  <div key={producto.id} className="list-group-item">
                    <div className="d-flex align-items-center mb-2">
                      <div className="form-check me-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={productosSeleccionados.includes(producto.id)}
                          onChange={(e) => handleSeleccionChange(e, producto.id)}
                          id={`check-${producto.id}`}
                        />
                      </div>
                      <div className="me-3" style={{ width: '50px', height: '50px' }}>
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="img-thumbnail"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-0">{producto.nombre}</h5>
                        <small className="text-muted">
                          Precio: {producto.precio}{DIVISA} | Tipo: {producto.tipo}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditar(producto)}
                        disabled={!isOnline}
                      >
                        {productoEditando === producto.id ? 'Cerrar' : 'Editar'}
                      </button>
                    </div>
                    
                    {/* Formulario de edición */}
                    {productoEditando === producto.id && (
                      <form onSubmit={(e) => handleSubmitEdicion(e, producto.id)} className="border p-3 mt-2 mb-2 rounded">
                        <div className="mb-3">
                          <label htmlFor="tipo" className="form-label">Tipo de producto:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="tipo"
                            value={formData.tipo}
                            disabled
                          />
                          <small className="text-muted">El tipo de producto no se puede modificar</small>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="nombre" className="form-label">Nombre:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="precio" className="form-label">Precio:</label>
                          <div className="input-group">
                            <span className="input-group-text">{DIVISA}</span>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              id="precio"
                              name="precio"
                              value={formData.precio}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="descripcion" className="form-label">Descripción:</label>
                          <textarea
                            className="form-control"
                            id="descripcion"
                            name="descripcion"
                            rows="3"
                            value={formData.descripcion}
                            onChange={handleChange}
                          />
                        </div>
                        
                        {/* Campos específicos según el tipo */}
                        {renderCamposExtra()}
                        
                        <div className="mb-3">
                          <label className="form-label">Imagen actual:</label>
                          <div className="mb-2">
                            <img
                              src={formData.imagen}
                              alt={formData.nombre}
                              className="img-thumbnail"
                              style={{ maxHeight: '100px' }}
                            />
                          </div>
                          
                          <label className="form-label">Cambiar imagen:</label>
                          <div className="border p-3 text-center">
                            <FileUploader
                              handleChange={handleFileChange}
                              name="file"
                              types={fileTypes}
                              onTypeError={handleTypeError}
                              children={
                                <div>
                                  <i className={`bi mb-2 ${file ? 'bi-check-circle-fill text-success' : 'bi-cloud-upload'}`}></i>
                                  <p className="mb-0">
                                    {file ? "Archivo seleccionado" : "Arrastra o haz clic para subir una imagen"}
                                  </p>
                                  {file && <p className="small text-muted mb-0">{file.name}</p>}
                                </div>
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => setProductoEditando(null)}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditarBorrarProductos;