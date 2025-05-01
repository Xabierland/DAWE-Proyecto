// Constantes requeridas
export const DIVISA = '€';
export const MAX_COPIAS = 20;

// URL por defecto, pero permitirá recibir la URL base desde fuera
let API_URL = 'https://dawe.xabierland.con/api';
//let API_URL = 'http://localhost:8000/api';

// Función para establecer la URL de la API de forma global
export const setApiUrl = (url) => {
  API_URL = url;
};

// Lista de productos que se cargará desde la API (inicialmente vacía)
export let listaProductos = [];

// Función para cargar productos desde la API
export const cargarProductos = async (apiUrl = null) => {
    const url = apiUrl || API_URL;
    try {
        //console.log('Iniciando carga de productos desde API...');
        const response = await fetch(`${url}/productos`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status}`);
        }
        
        const productosAPI = await response.json();
        //console.log(`Se han recibido ${productosAPI.length} productos de la API`);
        
        // Actualizar la lista de productos
        listaProductos = productosAPI.map(producto => {
            // El objeto base con propiedades comunes a todos los productos
            const productoMapeado = {
                id: producto.id,
                tipo: producto.tipo,
                nombre: producto.nombre,
                precio: producto.precio,
                descripcion: producto.descripcion,
                imagen: producto.imagen
            };
            
            // Añadir propiedades específicas según el tipo de producto
            switch (producto.tipo) {
                case 'libro_Fisico':
                    productoMapeado.autor = producto.autor;
                    productoMapeado.isbn = producto.isbn;
                    productoMapeado.paginas = producto.paginas;
                    break;
                case 'libro_Digital':
                    productoMapeado.autor = producto.autor;
                    productoMapeado.isbn = producto.isbn;
                    productoMapeado.paginas = producto.paginas;
                    productoMapeado.tamano = producto.tamano;
                    break;
                case 'ereader':
                    productoMapeado.resolucion = producto.resolucion;
                    break;
                case 'funda':
                    productoMapeado.material = producto.material;
                    break;
                case 'marcapaginas':
                    productoMapeado.color = producto.color;
                    break;
            }
            
            return productoMapeado;
        });
        
        //console.log('Productos cargados y mapeados correctamente');
        return listaProductos;
    } catch (error) {
        //console.error('Error al cargar productos desde la API:', error);
        return [];
    }
};

// Función para añadir un producto a través de la API
export const agregarNuevoProducto = async (tipo, datos, apiUrl = null) => {
    const url = apiUrl || API_URL;
    try {
        // Preparar los datos para enviar a la API
        const productoData = {
            tipo: tipo,
            nombre: datos.nombre,
            precio: parseFloat(datos.precio),
            descripcion: datos.descripcion || '',
            imagen: datos.imagen || '/imagenes/productos/default.png'
        };
        
        // Añadir campos específicos según el tipo
        switch (tipo) {
            case 'libro_Fisico':
                productoData.autor = datos.autor;
                productoData.isbn = datos.isbn;
                productoData.paginas = parseInt(datos.paginas);
                break;
            case 'libro_Digital':
                productoData.autor = datos.autor;
                productoData.isbn = datos.isbn;
                productoData.paginas = parseInt(datos.paginas);
                productoData.tamano = parseInt(datos.tamano);
                break;
            case 'ereader':
                productoData.resolucion = parseInt(datos.resolucion);
                break;
            case 'funda':
                productoData.material = datos.material;
                break;
            case 'marcapaginas':
                productoData.color = datos.color;
                break;
            default:
                return false;
        }
        
        // Enviar la petición POST para crear el producto
        //console.log('Enviando petición para crear producto:', productoData);
        const response = await fetch(`${url}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(productoData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear producto');
        }
        
        const resultado = await response.json();
        //console.log('Producto creado exitosamente:', resultado);
        
        // Recargar la lista de productos para incluir el nuevo
        await cargarProductos(url);
        return true;
    } catch (error) {
        //console.error('Error al añadir nuevo producto:', error);
        return false;
    }
};

// Funciones para gestionar el carrito en localStorage
export const guardarEnCarrito = (idProducto, item) => {
    try {
        // Asegurar que idProducto sea una cadena
        const idString = String(idProducto);
        localStorage.setItem(`producto_${idString}`, JSON.stringify(item));
        //console.log(`Producto guardado en carrito: ${idString}`, item);
    } catch (error) {
        //console.error('Error al guardar en localStorage:', error);
    }
    return;
};

// Función para borrar un producto del carrito
export const borrarDelCarrito = (idProducto) => {
    try {
        // Asegurar que idProducto sea una cadena
        const idString = String(idProducto);
        localStorage.removeItem(`producto_${idString}`);
        //console.log(`Producto eliminado del carrito: ${idString}`);
    } catch (error) {
        //console.error('Error al borrar del localStorage:', error);
    }
    return;
};

// Devuelve un Map con los productos del carrito
export const cargarCarrito = () => {      
    const carritoTemporal = new Map();

    try {
        // Obtener todas las claves de localStorage
        const keys = Object.keys(localStorage);

        // Filtrar solo las claves que comienzan con 'producto_'
        const productoKeys = keys.filter(key => key.startsWith('producto_'));
        
        //console.log('Claves de productos en localStorage:', productoKeys);

        // Recorrer las claves y añadir al carrito
        productoKeys.forEach(key => {
            try {
                const itemString = localStorage.getItem(key);
                if (!itemString) return;
                
                const item = JSON.parse(itemString);
                const productId = key.replace('producto_', '');
                
                // Si listaProductos está vacía, simplemente añadir al carrito
                if (!listaProductos || listaProductos.length === 0) {
                    //console.log('Lista de productos vacía, añadiendo producto directamente:', productId);
                    carritoTemporal.set(String(productId), item);
                    return;
                }
                
                // Buscar el producto en la lista cargada desde la API
                const producto = listaProductos.find(p => String(p.id) === String(productId));
                
                // Si no se encuentra el elemento se supone que se ha borrado del catálogo
                if (!producto) {
                    //console.log(`Producto no encontrado en catálogo, eliminando: ${productId}`);
                    borrarDelCarrito(productId);
                } else {
                    //console.log(`Producto encontrado y añadido al carrito: ${productId}`, item);
                    carritoTemporal.set(String(productId), item);
                }
            } catch (itemError) {
                //console.error(`Error procesando item ${key}:`, itemError);
                // Continuar con el siguiente item
            }
        });
    } catch (error) {
        //console.error('Error al cargar el carrito:', error);
    }

    //console.log('Carrito cargado:', carritoTemporal);
    return carritoTemporal;
};

// Inicialización: Cargar productos al importar este módulo
// Esto ahora se manejará desde App.js para poder pasar la URL base