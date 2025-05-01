import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { cargarProductos, cargarCarrito } from './tienda/tienda';

// Importar componentes
import Cabecera from './componentes/Cabecera';
import MenuNavegacion from './componentes/MenuNavegacion';
import EscaparateProductos from './componentes/EscaparateProductos';
import FormularioNuevosProductos from './componentes/FormularioNuevosProductos';
import Pie from './componentes/Pie';
import Carrito from './componentes/Carrito';
import OverflowContainer from './componentes/OverflowContainer';
import PanelAutenticacion from './componentes/PanelAutenticacion';
import PanelUsuario from './componentes/PanelUsuario';
import MiCuenta from './componentes/MiCuenta';
import EditarBorrarProductos from './componentes/EditarBorrarProductos';

// URL base para las peticiones a la API - CENTRALIZADA AQUÍ
const API_BASE_URL = 'https://dawe.xabierland.com/api';
//const API_BASE_URL = 'http://localhost:8000/api';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Función para manejar cambios en la conexión
    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
    };
    
    // Configurar listeners para detectar estado de conexión
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);
  
  return isOnline;
}

function App() {
  // Estado para detectar conexión
  const isOnline = useOnlineStatus();

  // Estado para el carrito
  const [carrito, setCarrito] = useState(new Map());

  // Estado para mostrar carrito
  const [showCarrito, setShowCarrito] = useState(false);
  
  // Estado: Número de elementos en el carrito
  const [carritoCount, setCarritoCount] = useState(0);
  
  // Estado para señalizar actualizaciones del carrito (usando función para evitar dependencias)
  const [carritoUpdated, setCarritoUpdated] = useState(0);
  const updateCarrito = useCallback(() => {
    setCarritoUpdated(prev => prev + 1);
  }, []);
  
  // Estado para señalizar nuevos productos añadidos (usando función para evitar dependencias)
  const [productosUpdated, setProductosUpdated] = useState(0);
  const onProductoAdded = useCallback(() => {
    setProductosUpdated(prev => prev + 1);
  }, []);

  // Estado para controlar el overflow del body
  const [bodyOverflowHidden, setBodyOverflowHidden] = useState(false);
  
  // Estado para gestionar la autenticación de usuarios
  const [usuario, setUsuario] = useState(null);
  // Estado para controlar si la app está cargando inicialmente
  const [loading, setLoading] = useState(true);
  // Estado para controlar errores de carga
  const [error, setError] = useState(null);
  
  // Estado para controlar la sección actual
  const [seccionActual, setSeccionActual] = useState('escaparate');
  
  // Flag para evitar múltiples intentos de autenticación
  const authInProgress = useRef(false);
  
  // Cargar productos y carrito al iniciar la aplicación
  useEffect(() => {
    const inicializarApp = async () => {
      try {
        setLoading(true);
        // Cargar los productos desde la API
        console.log('Inicializando aplicación...');
        console.log('Cargando productos desde la API...');
        const productosObtenidos = await cargarProductos(API_BASE_URL);
        console.log(`Se han cargado ${productosObtenidos.length} productos correctamente`);
        
        // Una vez cargados los productos, cargar el carrito
        console.log('Cargando carrito desde localStorage...');
        const carritoObtenido = cargarCarrito();
        setCarrito(carritoObtenido);
        
        // Actualizar contador del carrito
        let total = 0;
        carritoObtenido.forEach((item) => {
          total += item.cantidad;
        });
        setCarritoCount(total);
        
        console.log(`Carrito cargado con ${total} elementos`);
        setLoading(false);
      } catch (err) {
        console.error('Error al inicializar la aplicación:', err);
        setError('Error al cargar datos iniciales. Por favor, recarga la página.');
        setLoading(false);
      }
    };
    
    inicializarApp();
  }, []);
  
  // Escuchar eventos de modal y carrito para controlar el scroll del body
  useEffect(() => {
    const handleModalState = (event) => {
      setBodyOverflowHidden(event.detail.isOpen);
    };
    
    const handleCarritoState = (event) => {
      setBodyOverflowHidden(event.detail.isOpen);
    };
    
    window.addEventListener('modalState', handleModalState);
    window.addEventListener('carritoState', handleCarritoState);
    
    return () => {
      window.removeEventListener('modalState', handleModalState);
      window.removeEventListener('carritoState', handleCarritoState);
    };
  }, []);

  // Verificar la sesión al cargar la aplicación
  useEffect(() => {
    const verificarSesionBackend = async () => {
      if (authInProgress.current) return;
      authInProgress.current = true;
      
      try {
        setLoading(true);
        console.log('Verificando sesión existente en el backend...');
        
        const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Sesión recuperada del backend:', userData);
          setUsuario(userData);
          setLoading(false);
          authInProgress.current = false;
          return true;
        }
        
        setLoading(false);
        authInProgress.current = false;
        return false;
      } catch (error) {
        console.error('Error al verificar sesión con el backend:', error);
        setLoading(false);
        authInProgress.current = false;
        return false;
      }
    };
    
    verificarSesionBackend();
  }, []);

  // Escuchar cambios en el estado de autenticación de Firebase
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Estado de Firebase Auth cambió:', user ? `Usuario: ${user.email}` : 'No hay usuario');
      
      // Si ya estamos autenticados en el backend, no hacer nada
      if (usuario) return;
      
      // Si hay usuario en Firebase pero no en el backend, iniciar sesión en el backend
      if (user && !usuario && !authInProgress.current) {
        authInProgress.current = true;
        setLoading(true);
        
        try {
          console.log('Iniciando sesión en el backend con:', user.email);
          const loginResponse = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: user.email }),
          });
          
          if (loginResponse.ok) {
            const userData = await loginResponse.json();
            console.log('Sesión iniciada en el backend:', userData);
            setUsuario(userData);
          } else {
            console.error('Error al iniciar sesión en el backend:', await loginResponse.text());
            // Si hay error al iniciar sesión en el backend, cerrar sesión en Firebase
            await auth.signOut();
          }
        } catch (error) {
          console.error('Error de red al iniciar sesión en el backend:', error);
        } finally {
          setLoading(false);
          authInProgress.current = false;
        }
      }
    });
    
    return () => unsubscribe();
  }, [usuario]);

  // Manejar el inicio de sesión exitoso
  const handleLogin = (userData) => {
    console.log('Login exitoso:', userData);
    setUsuario(userData);
  };

  // Manejar el cierre de sesión
  const handleLogout = () => {
    setUsuario(null);
    setSeccionActual('escaparate'); // Volver al escaparate al cerrar sesión
  };

  // Función para cambiar la sección actual
  const cambiarSeccion = (seccion) => {
    setSeccionActual(seccion);
    if (showCarrito) {
      setShowCarrito(false);
    }
  };

  // Renderizar sección principal según la selección
  const renderizarSeccionPrincipal = () => {
    switch (seccionActual) {
      case 'mi-cuenta':
        return (
          <MiCuenta 
            usuario={usuario} 
            isOnline={isOnline}
            apiBaseUrl={API_BASE_URL}
            onActualizar={(datosActualizados) => {
              // Actualizar los datos del usuario en el estado
              setUsuario(prev => ({
                ...prev,
                usuario: {
                  ...prev.usuario,
                  ...datosActualizados
                }
              }));
            }} 
          />
        );
      case 'anadir-producto':
        return (
          <FormularioNuevosProductos 
            isOnline={isOnline}
            apiBaseUrl={API_BASE_URL}
            onProductoAdded={onProductoAdded}
          />
        );
      case 'editar-borrar-productos':
        return (
          <EditarBorrarProductos 
            onProductoUpdated={onProductoAdded}
            isOnline={isOnline}
            apiBaseUrl={API_BASE_URL}
          />
        );
      case 'escaparate':
      default:
        return (
          <EscaparateProductos 
            updateCarritoCount={setCarritoCount}
            updateCarrito={updateCarrito}
            productosUpdated={productosUpdated}
            mapaCarrito={carrito}
            setCarrito={setCarrito}
            apiBaseUrl={API_BASE_URL}
          />
        );
    }
  };

  // Renderizar el contenido del aside según el estado de autenticación
  const renderizarAside = () => {
    if (loading) {
      return (
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Verificando sesión...</p>
          </div>
        </div>
      );
    } else if (usuario) {
      return (
        <PanelUsuario 
          usuario={usuario} 
          onLogout={handleLogout}
          apiBaseUrl={API_BASE_URL}
        />
      );
    } else {
      return (
        <PanelAutenticacion 
          onLogin={handleLogin}
          isOnline={isOnline}
          apiBaseUrl={API_BASE_URL}
        />
      );
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error en la aplicación</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-danger"
            onClick={() => window.location.reload()}
          >
            Recargar aplicación
          </button>
        </div>
      </div>
    );
  }

  return (
    <OverflowContainer isHidden={bodyOverflowHidden}>
      <div className="contenedor">
        <Cabecera titulo="El Mono Infinito" />
        
        <MenuNavegacion 
          carritoCount={carritoCount}
          toggleCarrito={() => setShowCarrito(!showCarrito)} 
          isOnline={isOnline}
          usuario={usuario}
          seccionActual={seccionActual}
          cambiarSeccion={cambiarSeccion}
        />
        
        {showCarrito && (
          <Carrito 
            setShowCarritoProp={setShowCarrito}
            setCarritoCountProp={setCarritoCount}
            carritoUpdatedProp={carritoUpdated}
            carrito={carrito}
            setCarrito={setCarrito}
            apiBaseUrl={API_BASE_URL}
          />
        )}
        
        <div className="row">
          <main className="col-md-8 order-md-1">
            {renderizarSeccionPrincipal()}
          </main>
          
          <aside className="col-md-4 order-md-2">
            {renderizarAside()}
          </aside>
        </div>
      </div>
      <Pie contenido="© 2025 El Mono Infinito. Todos los derechos reservados." />
    </OverflowContainer>
  );
}

export default App;