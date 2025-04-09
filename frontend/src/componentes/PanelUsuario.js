import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:8000/api';

const PanelUsuario = ({ usuario, onLogout }) => {
  const [visitas, setVisitas] = useState(usuario?.visitas || 1);
  const [loading, setLoading] = useState(false);
  const [visitaIncrementada, setVisitaIncrementada] = useState(false);
  const auth = getAuth();
  
  // Efecto para incrementar contador de visitas al montar el componente (una sola vez)
  useEffect(() => {
    const incrementarVisita = async () => {
      if (visitaIncrementada) return;
      
      try {
        console.log('Incrementando contador de visitas...');
        const response = await fetch(`${API_BASE_URL}/usuarios/incrementar-visitas`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Contador de visitas actualizado:', data.visitas);
          setVisitas(data.visitas);
          setVisitaIncrementada(true);
        } else {
          console.error('Error incrementando visitas:', await response.text());
        }
      } catch (error) {
        console.error('Error al incrementar visitas:', error);
      }
    };

    // Incrementar visita una vez al montar el componente
    incrementarVisita();
  }, [visitaIncrementada]);
  
  // Efecto para obtener perfil actualizado periódicamente
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        console.log('Obteniendo perfil actualizado desde el backend...');
        const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Perfil actualizado recibido:', data);
          setVisitas(data.visitas);
        } else {
          console.error('Error obteniendo perfil:', await response.text());
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };
    
    // Configurar intervalo para actualizar el perfil cada minuto
    const intervalo = setInterval(obtenerPerfil, 60000);
    
    return () => clearInterval(intervalo);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      console.log('Cerrando sesión...');
      
      // Cerrar sesión en el backend primero
      const response = await fetch(`${API_BASE_URL}/usuarios/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        console.error('Error al cerrar sesión en el backend:', await response.text());
      } else {
        console.log('Sesión cerrada correctamente en el backend');
      }
      
      // Cerrar sesión en Firebase
      await signOut(auth);
      console.log('Sesión cerrada en Firebase');
      
      // Notificar al componente padre que el cierre de sesión fue exitoso
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
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
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Cerrando sesión...
            </>
          ) : 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  );
};

export default PanelUsuario;