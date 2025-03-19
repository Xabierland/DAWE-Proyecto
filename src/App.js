import React, { useState, useEffect } from 'react';
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
  // Estado para mostrar carrito
  const [showCarrito, setShowCarrito] = useState(false);
  // Estado para detectar conexión usando nuestro hook personalizado
  const isOnline = useOnlineStatus();
  // Estado para carrito (ahora simplificado, la lógica real se mueve a Carrito.js)
  const [carritoCount, setCarritoCount] = useState(0);
  // Estado para señalizar actualizaciones del carrito
  const [carritoUpdated, setCarritoUpdated] = useState(0);
  // Estado para señalizar nuevos productos añadidos
  const [productosUpdated, setProductosUpdated] = useState(0);

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
            setShowCarrito={setShowCarrito}
            setCarritoCount={setCarritoCount}
            carritoUpdated={carritoUpdated}
          />
        )}
        
        <div className="row">
          <main className="col-md-8 order-md-1">
            <EscaparateProductos 
              updateCarritoCount={setCarritoCount}
              updateCarrito={() => setCarritoUpdated(prev => prev + 1)}
              isOnline={isOnline}
              productosUpdated={productosUpdated}
            />
          </main>
          
          <aside className="col-md-4 order-md-2">
            <FormularioNuevosProductos 
              isOnline={isOnline}
              onProductoAdded={() => setProductosUpdated(prev => prev + 1)}
            />
          </aside>
        </div>
      </div>
      <Pie contenido="© 2025 El Mono Infinito. Todos los derechos reservados." />
    </div>
  );
}

export default App;