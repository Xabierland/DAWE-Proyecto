import React, { useState, useEffect } from 'react';

const MiCuenta = ({ usuario, onActualizar, isOnline, apiBaseUrl }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    animalFavorito: '',
    libroFavorito: '',
    generoFavorito: ''
  });
  
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (usuario && usuario.usuario) {
      setFormData({
        nombre: usuario.usuario.nombre || '',
        email: usuario.usuario.email || '',
        animalFavorito: usuario.usuario.animalFavorito || '',
        libroFavorito: usuario.usuario.libroFavorito || '',
        generoFavorito: usuario.usuario.generoFavorito || ''
      });
    }
  }, [usuario]);
  
  const handleChange = (e) => 
  {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que el nombre no esté vacío
    if (!formData.nombre.trim()) {
      setError('El nombre no puede estar vacío');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setLoading(true);
    setError('');
    setExito('');
    
    try {
      const response = await fetch(`${apiBaseUrl}/usuarios/actualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: formData.nombre,
          animalFavorito: formData.animalFavorito,
          libroFavorito: formData.libroFavorito,
          generoFavorito: formData.generoFavorito
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar el perfil');
      }
      
      const data = await response.json();
      
      // Mostrar mensaje de éxito
      setExito('Perfil actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
      
      // Notificar al componente padre para actualizar el estado global
      if (onActualizar) {
        onActualizar(data.usuario);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError(error.message || 'Error al actualizar el perfil');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title h5 mb-0">Mi Cuenta</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              disabled
            />
            <small className="text-muted">El email no se puede modificar</small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="animalFavorito" className="form-label">Animal Favorito:</label>
            <input
              type="text"
              className="form-control"
              id="animalFavorito"
              name="animalFavorito"
              value={formData.animalFavorito}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="libroFavorito" className="form-label">Libro Favorito:</label>
            <input
              type="text"
              className="form-control"
              id="libroFavorito"
              name="libroFavorito"
              value={formData.libroFavorito}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="generoFavorito" className="form-label">Género Literario Favorito:</label>
            <input
              type="text"
              className="form-control"
              id="generoFavorito"
              name="generoFavorito"
              value={formData.generoFavorito}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || !isOnline}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <p> </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {exito && (
            <div className="alert alert-success" role="alert">
              {exito}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MiCuenta;