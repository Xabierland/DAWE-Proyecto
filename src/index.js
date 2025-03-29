import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Importar Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Importar Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres que tu aplicación funcione sin conexión y cargue más rápido,
// cambia unregister() a register() a continuación. Ten en cuenta que esto viene
// con algunas desventajas.
// Más información sobre service workers: https://cra.link/PWA
serviceWorkerRegistration.register();