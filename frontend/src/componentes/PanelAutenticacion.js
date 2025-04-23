import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Configuración de Firebase (sustituye con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyCkuYvg4KV6SaVZzUBrvNBW8fAqAUwmWKA",
  authDomain: "dawe-proyecto-facbc.firebaseapp.com",
  projectId: "dawe-proyecto-facbc",
  storageBucket: "dawe-proyecto-facbc.firebasestorage.app",
  messagingSenderId: "1071628435716",
  appId: "1:1071628435716:web:a1e244ae7674e9d55bd051",
  measurementId: "G-SG68Y04JPN"
};

// API URL base
const API_BASE_URL = 'http://localhost:8000/api';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configurar persistencia local para mantener la sesión entre recargas
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistencia de Firebase configurada a LOCAL');
  })
  .catch((error) => {
    console.error('Error configurando persistencia de Firebase:', error);
  });

const PanelAutenticacion = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Usuario autenticado en Firebase:', user.email);
      
      // Llamar a la API para iniciar sesión en el backend
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para las cookies de sesión
        body: JSON.stringify({ 
          email: user.email 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al iniciar sesión en el servidor');
      }

      const userData = await response.json();
      console.log('Sesión iniciada en el backend:', userData);
      
      // Notificar al componente padre que el inicio de sesión fue exitoso
      if (onLogin) {
        onLogin(userData);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Manejar diferentes tipos de errores de Firebase para mostrar mensajes más amigables
      let mensajeError = error.message || 'Error al iniciar sesión';
      
      if (error.code === 'auth/invalid-credential') {
        mensajeError = 'Credenciales incorrectas. Por favor verifica tu email y contraseña.';
      } else if (error.code === 'auth/user-not-found') {
        mensajeError = 'No existe una cuenta con este email.';
      } else if (error.code === 'auth/wrong-password') {
        mensajeError = 'Contraseña incorrecta.';
      } else if (error.code === 'auth/too-many-requests') {
        mensajeError = 'Demasiados intentos fallidos. Por favor, inténtalo más tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        mensajeError = 'Error de red. Verifica tu conexión a internet.';
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title h5 mb-0">Iniciar Sesión</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PanelAutenticacion;