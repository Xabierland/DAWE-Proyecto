import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

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
  
  // Estado para controlar la sección actual
  const [seccionActual, setSeccionActual] = useState('escaparate');
  
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

  // Manejar el inicio de sesión exitoso
  const handleLogin = (userData) => {
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
            onProductoAdded={onProductoAdded}
          />
        );
      case 'editar-borrar-productos':
        return (
          <EditarBorrarProductos 
            onProductoUpdated={onProductoAdded}
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
          />
        );
    }
  };

  // Renderizar el contenido del aside según el estado de autenticación
  const renderizarAside = () => {
    if (usuario) {
      return (
        <PanelUsuario 
          usuario={usuario} 
          onLogout={handleLogout} 
        />
      );
    } else {
      return (
        <PanelAutenticacion onLogin={handleLogin} />
      );
    }
  };

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