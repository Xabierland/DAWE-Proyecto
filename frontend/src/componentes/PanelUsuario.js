import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

const PanelUsuario = ({ usuario, onLogout }) => {
  const [visitas, setVisitas] = useState(usuario?.visitas || 1);
  const auth = getAuth();
  
  // Efecto para verificar el estado actual de la sesión y actualizar contador de visitas
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/usuarios/perfil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Importante para las cookies de sesión
        });

        if (response.ok) {
          const data = await response.json();
          setVisitas(data.visitas);
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    obtenerPerfil();
  }, []);

  const handleLogout = async () => {
    try {
      // Cerrar sesión en Firebase
      await signOut(auth);
      
      // Cerrar sesión en el backend
      await fetch('http://localhost:8000/api/usuarios/logout', {
        method: 'POST',
        credentials: 'include', // Importante para las cookies de sesión
      });
      
      // Notificar al componente padre que el cierre de sesión fue exitoso
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title h5 mb-0">Bienvenido/a, {usuario.usuario.nombre}</h2>
      </div>
      <div className="card-body">
        <div className="alert alert-info mb-3">
          <div className="mb-1">
            <strong>Rol:</strong> {usuario.usuario.rol === 'administrador' ? 'Administrador' : 'Usuario'}
          </div>
          <div>
            <strong>Visitas:</strong> {visitas}
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="btn btn-danger w-100"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default PanelUsuario;