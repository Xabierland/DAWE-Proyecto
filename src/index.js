import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

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

// Si quieres empezar a medir el rendimiento en tu aplicación, pasa una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o enviar a un punto final de análisis. Más información: https://bit.ly/CRA-vitals
reportWebVitals();