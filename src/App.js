import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Importar componentes
import Cabecera from './componentes/Cabecera';
import MenuNavegacion from './componentes/MenuNavegacion';
import EscaparateProductos from './componentes/EscaparateProductos';
import FormularioNuevosProductos from './componentes/FormularioNuevosProductos';
import Pie from './componentes/Pie';
import Carrito from './componentes/Carrito';

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
  
  // Usar efecto para aplicar la clase CSS al body cuando cambia bodyOverflowHidden
  useEffect(() => {
    if (bodyOverflowHidden) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    // Limpiar efecto al desmontar
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [bodyOverflowHidden]);
  
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

  return (
    <div>
      <div className="contenedor">
        <Cabecera titulo="El Mono Infinito" />
        
        <MenuNavegacion 
          carritoCount={carritoCount}
          toggleCarrito={() => setShowCarrito(!showCarrito)} 
          isOnline={isOnline}
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
            <EscaparateProductos 
              updateCarritoCount={setCarritoCount}
              updateCarrito={updateCarrito}
              isOnline={isOnline}
              productosUpdated={productosUpdated}
              mapaCarrito={carrito}
              setCarrito={setCarrito}
            />
          </main>
          
          <aside className="col-md-4 order-md-2">
            <FormularioNuevosProductos 
              isOnline={isOnline}
              onProductoAdded={onProductoAdded}
            />
          </aside>
        </div>
      </div>
      <Pie contenido="© 2025 El Mono Infinito. Todos los derechos reservados." />
    </div>
  );
}

export default App;