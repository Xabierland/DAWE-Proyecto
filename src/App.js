import React, { useState, useEffect } from 'react';
import { listaProductos } from './tienda/tienda';
import './App.css';

// Importar componentes
import Cabecera from './componentes/Cabecera';
import MenuNavegacion from './componentes/MenuNavegacion';
import EscaparateProductos from './componentes/EscaparateProductos';
import FormularioNuevosProductos from './componentes/FormularioNuevosProductos';
import Pie from './componentes/Pie';
import Carrito from './componentes/Carrito';

function App() {
  // Estado para el listado de productos y filtrados
  const [productos, setProductos] = useState(listaProductos);
  const [productosFiltrados, setProductosFiltrados] = useState([...productos]);
  
  // Estado para el carrito
  const [carrito, setCarrito] = useState(new Map());
  
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPerPage] = useState(6);
  
  // Estado para filtros
  const [filtroActual, setFiltroActual] = useState({
    tipo: 'all',
    precioMin: 0,
    precioMax: Number.MAX_SAFE_INTEGER,
    ordenamiento: null
  });
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para mostrar detalles de producto
  const [productoDetalle, setProductoDetalle] = useState(null);
  
  // Estado para detectar conexión
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Estado para mostrar carrito
  const [showCarrito, setShowCarrito] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    // Implementar carga del carrito desde localStorage
    const carritoGuardado = cargarCarritoDesdeStorage();
    if (carritoGuardado.size > 0) {
      setCarrito(carritoGuardado);
    }
    
    // Configurar listeners para detectar estado de conexión
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);
  
  // Función para manejar cambios en la conexión
  const handleConnectionChange = () => {
    setIsOnline(navigator.onLine);
  };
  
  // Cargar carrito desde localStorage
  const cargarCarritoDesdeStorage = () => {
    const tempCarrito = new Map();
    try {
      // Obtener todas las claves de localStorage
      const keys = Object.keys(localStorage);
      
      // Filtrar solo las claves que comienzan con 'producto_'
      const productoKeys = keys.filter(key => key.startsWith('producto_'));
      
      // Recorrer las claves y añadir al carrito
      productoKeys.forEach(key => {
        const item = JSON.parse(localStorage.getItem(key));
        const productId = key.replace('producto_', '');
        tempCarrito.set(productId, item);
      });
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    }
    
    return tempCarrito;
  };
  
  // Función para buscar productos
  const buscarProductos = (term) => {
    setSearchTerm(term);
    const termLower = term.toLowerCase();
    
    if (!term) {
      aplicarTodosFiltros(productos);
    } else {
      const filtrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(termLower)
      );
      setProductosFiltrados(filtrados);
    }
    
    // Reset a la primera página
    setCurrentPage(1);
  };
  
  // Función para aplicar todos los filtros
  const aplicarTodosFiltros = (productosBase = productos) => {
    // 1. Comenzar con todos los productos o los filtrados por búsqueda
    let resultados = [...productosBase];
    
    // 2. Aplicar filtro por tipo
    if (filtroActual.tipo !== 'all') {
      resultados = resultados.filter(producto => 
        producto.tipo === filtroActual.tipo
      );
    }
    
    // 3. Aplicar filtro por rango de precio
    resultados = resultados.filter(producto => 
      producto.precio >= filtroActual.precioMin && 
      producto.precio <= filtroActual.precioMax
    );
    
    // 4. Aplicar ordenamiento
    if (filtroActual.ordenamiento) {
      resultados.sort((a, b) => {
        return filtroActual.ordenamiento === 'asc'
          ? a.precio - b.precio
          : b.precio - a.precio;
      });
    }
    
    // 5. Actualizar productos filtrados
    setProductosFiltrados(resultados);
    
    // Resetear página
    setCurrentPage(1);
  };
  
  // Función para resetear filtros
  const resetearFiltros = () => {
    setFiltroActual({
      tipo: 'all',
      precioMin: 0,
      precioMax: Number.MAX_SAFE_INTEGER,
      ordenamiento: null
    });
    
    // Si hay término de búsqueda, aplicarlo de nuevo
    if (searchTerm) {
      buscarProductos(searchTerm);
    } else {
      setProductosFiltrados([...productos]);
    }
  };
  
  // Función para añadir producto al carrito
  const agregarAlCarrito = (productId) => {
    const MAX_COPIAS = 20; // Máximo de copias por producto
    const producto = productos.find(p => p.id === productId);
    
    if (!producto) return;
    
    const nuevoCarrito = new Map(carrito);
    
    if (nuevoCarrito.has(productId)) {
      // Producto ya en carrito, aumentar cantidad
      const item = nuevoCarrito.get(productId);
      if (item.cantidad < MAX_COPIAS) {
        item.cantidad++;
        nuevoCarrito.set(productId, item);
        
        // Guardar en localStorage
        guardarEnCarrito(productId, item);
      } else {
        // Mostrar mensaje de error (implementar después)
        console.log('Máximo de copias alcanzado');
        return;
      }
    } else {
      // Nuevo producto
      const item = {
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      };
      nuevoCarrito.set(productId, item);
      
      // Guardar en localStorage
      guardarEnCarrito(productId, item);
    }
    
    setCarrito(nuevoCarrito);
  };
  
  // Función para guardar en localStorage
  const guardarEnCarrito = (productId, item) => {
    try {
      localStorage.setItem(`producto_${productId}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };
  
  // Función para eliminar del localStorage
  const borrarDelCarrito = (productId) => {
    try {
      localStorage.removeItem(`producto_${productId}`);
    } catch (error) {
      console.error('Error al borrar del localStorage:', error);
    }
  };
  
  // Función para actualizar cantidad de producto
  const actualizarCantidad = (productId, newQuantity) => {
    const MAX_COPIAS = 20;
    const nuevoCarrito = new Map(carrito);
    
    if (!nuevoCarrito.has(productId)) return;
    
    if (newQuantity <= 0) {
      // Eliminar producto
      nuevoCarrito.delete(productId);
      borrarDelCarrito(productId);
    } else if (newQuantity > MAX_COPIAS) {
      // Mensaje de error (implementar después)
      console.log('Máximo de copias alcanzado');
      return;
    } else {
      // Actualizar cantidad
      const item = nuevoCarrito.get(productId);
      item.cantidad = newQuantity;
      nuevoCarrito.set(productId, item);
      guardarEnCarrito(productId, item);
    }
    
    setCarrito(nuevoCarrito);
  };
  
  // Función para añadir nuevo producto
  const agregarNuevoProducto = (nuevoProducto) => {
    const nuevosProductos = [...productos, nuevoProducto];
    setProductos(nuevosProductos);
    
    // Si no hay filtros activos, también añadirlo a filtrados
    if (filtroActual.tipo === 'all' && 
        !searchTerm && 
        filtroActual.precioMin === 0 && 
        filtroActual.precioMax === Number.MAX_SAFE_INTEGER) {
      setProductosFiltrados([...productosFiltrados, nuevoProducto]);
    }
  };
  
  // Función para cambiar página
  const cambiarPagina = (numeroPagina) => {
    setCurrentPage(numeroPagina);
  };
  
  // Función para actualizar filtros
  const actualizarFiltro = (tipoFiltro, valor) => {
    const nuevoFiltro = {...filtroActual};
    
    switch(tipoFiltro) {
      case 'tipo':
        nuevoFiltro.tipo = valor;
        break;
      case 'precioMin':
        nuevoFiltro.precioMin = valor === '' ? 0 : Number(valor);
        break;
      case 'precioMax':
        nuevoFiltro.precioMax = valor === '' ? Number.MAX_SAFE_INTEGER : Number(valor);
        break;
      case 'ordenamiento':
        nuevoFiltro.ordenamiento = valor;
        break;
      default:
        return;
    }
    
    setFiltroActual(nuevoFiltro);
    
    // Aplicar los filtros con el nuevo valor
    const tempProductos = searchTerm ? 
      productos.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())) : 
      [...productos];
      
    // 1. Comenzar con todos los productos o los filtrados por búsqueda
    let resultados = [...tempProductos];
    
    // 2. Aplicar filtro por tipo
    if (nuevoFiltro.tipo !== 'all') {
      resultados = resultados.filter(producto => 
        producto.tipo === nuevoFiltro.tipo
      );
    }
    
    // 3. Aplicar filtro por rango de precio
    resultados = resultados.filter(producto => 
      producto.precio >= nuevoFiltro.precioMin && 
      producto.precio <= nuevoFiltro.precioMax
    );
    
    // 4. Aplicar ordenamiento
    if (nuevoFiltro.ordenamiento) {
      resultados.sort((a, b) => {
        return nuevoFiltro.ordenamiento === 'asc'
          ? a.precio - b.precio
          : b.precio - a.precio;
      });
    }
    
    // 5. Actualizar productos filtrados
    setProductosFiltrados(resultados);
    // Resetear página
    setCurrentPage(1);
  };

  return (
    <div className="contenedor">
      <Cabecera titulo="El Mono Infinito" />
      
      <MenuNavegacion 
        carritoCount={Array.from(carrito.values()).reduce((total, item) => total + item.cantidad, 0)}
        toggleCarrito={() => setShowCarrito(!showCarrito)} 
        isOnline={isOnline}
      />
      
      {showCarrito && (
        <Carrito 
          carrito={carrito}
          actualizarCantidad={actualizarCantidad}
          setShowCarrito={setShowCarrito}
        />
      )}
      
      <div className="row">
        <main className="col-md-8 order-md-1">
          <EscaparateProductos 
            productos={productosFiltrados}
            currentPage={currentPage}
            productosPerPage={productosPerPage}
            cambiarPagina={cambiarPagina}
            agregarAlCarrito={agregarAlCarrito}
            setProductoDetalle={setProductoDetalle}
            productoDetalle={productoDetalle}
            filtroActual={filtroActual}
            actualizarFiltro={actualizarFiltro}
            resetearFiltros={resetearFiltros}
            buscarProductos={buscarProductos}
            searchTerm={searchTerm}
          />
        </main>
        
        <aside className="col-md-4 order-md-2">
          <FormularioNuevosProductos 
            agregarNuevoProducto={agregarNuevoProducto} 
            isOnline={isOnline}
          />
        </aside>
      </div>
      
      <Pie contenido="© 2025 El Mono Infinito. Todos los derechos reservados." />
    </div>
  );
}

export default App;