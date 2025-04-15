// Constantes requeridas
export const DIVISA = '€';
export const MAX_COPIAS = 20;
export const API_URL = 'http://localhost:8000/api';

// Lista de productos que se cargará desde la API (inicialmente vacía)
export let listaProductos = [];

// Función para cargar productos desde la API
export const cargarProductos = async () => {
    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status}`);
        }
        
        const productosAPI = await response.json();
        
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
        
        return listaProductos;
    } catch (error) {
        console.error('Error al cargar productos desde la API:', error);
        return [];
    }
};

// Función para añadir un producto a través de la API
export const agregarNuevoProducto = async (tipo, datos) => {
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
        const response = await fetch(`${API_URL}/productos`, {
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
        
        // Recargar la lista de productos para incluir el nuevo
        await cargarProductos();
        return true;
    } catch (error) {
        console.error('Error al añadir nuevo producto:', error);
        return false;
    }
};

// Funciones para gestionar el carrito en localStorage
export const guardarEnCarrito = (idProducto, item) => {
    try {
        localStorage.setItem(`producto_${idProducto}`, JSON.stringify(item));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
    return;
};

// Función para borrar un producto del carrito
export const borrarDelCarrito = (idProducto) => {
    try {
        localStorage.removeItem(`producto_${idProducto}`);
    } catch (error) {
        console.error('Error al borrar del localStorage:', error);
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

        // Recorrer las claves y añadir al carrito
        productoKeys.forEach(key => {
            const item = JSON.parse(localStorage.getItem(key));
            const productId = key.replace('producto_', '');
            
            // Buscar el producto en la lista cargada desde la API
            const producto = listaProductos.find(p => p.id === productId);
            
            // Si no se encuentra el elemento se supone que se ha borrado del catálogo
            if (!producto) {
                borrarDelCarrito(productId);
            } else {
                carritoTemporal.set(String(productId), item);
            }
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }

    return carritoTemporal;
};

// Cargar los productos al importar este módulo
cargarProductos().catch(err => {
    console.error('Error al cargar productos iniciales:', err);
});