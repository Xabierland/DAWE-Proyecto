import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
      
      // Llamar a la API para iniciar sesión en el backend
      const response = await fetch('http://localhost:8000/api/usuarios/login', {
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
      
      // Notificar al componente padre que el inicio de sesión fue exitoso
      if (onLogin) {
        onLogin(userData);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.message || 'Error al iniciar sesión');
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
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PanelAutenticacion;