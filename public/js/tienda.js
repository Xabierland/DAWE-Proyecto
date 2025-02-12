import {Libro, Ebook, Ereader, Marcapaginas, Funda} from './productos.js';

// Lista de productos base
const listaProductos = [
   // Libros Físicos
   new Libro("El tunel", 1, "Hay un tunel", "Ernesto Sabato", 1, 100, '//img/productos/ElTunel.jpg'),
   new Libro("Viento y verdad", 5, "Viaje antes que destino", "Brandon Sanderson", 3, 1400, '/img/VientoYVerdad.jpg'),
   new Libro("El nombre del viento", 20, "La historia de un músico, mago y leyenda", "Patrick Rothfuss", 5, 800, '/img/productos/ElNombreDelViento.jpg'),

   // Libros Electrónicos
   new Ebook("Dungeon Crawler Carl", 5, "The apocalypse will be televised", "Matt Dinniman", 2, 400, 300),
   new Ebook("Dungeon Crawler Carl: Carl's doomsday scenario", 6, "The apocalypse will be televised", "Matt Dinniman", 4, 500, 300),
   new Ebook("El camino de los reyes", 15, "La historia de Kaladin", "Brandon Sanderson", 6, 1200, 500),
   new Ebook("Palabras radiantes", 15, "La historia de Shallan", "Brandon Sanderson", 7, 1300, 550),

   // Ereaders
   new Ereader("Kobo clara", 127, "Lee mucho", 300),
   new Ereader("Kindle Paperwhite", 150, "Ahora resistente al agua", 350),
   new Ereader("Kobo Libra", 180, "Pantalla de alta resolución", 400),

   // Marcapáginas
   new Marcapaginas("Marcapáginas de cartón", 2, "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure", "Cartón"),
   new Marcapaginas("Marcapáginas azul", 2, "Marca las páginas", "Azul"),
   new Marcapaginas("Marcapáginas metálico", 5, "Elegante marcador metálico", "Plata"),

   // Fundas
   new Funda("Funda Kobo Clara X5", 20, "Enfunda", "Wolframio"),
   new Funda("Funda Kindle Paperwhite", 20, "Enfunda", "Plastico duro"),
   new Funda("Funda Universal", 15, "Compatible con varios modelos", "Cuero")
];

const carrito = new Map();

// Funciones de productos
export function obtenerProductos() {
   return listaProductos;
}

// 
export function obtenerCarrito() {
    return carrito;
}

// Función para añadir nuevo producto
export function agregarNuevoProducto(tipo, datos) {
    let nuevoProducto;

    switch(tipo) {
        case 'libro_Fisico':
            nuevoProducto = new Libro(
                datos.nombre,
                datos.precio,
                datos.descripcion,
                datos.autor,
                datos.isbn,
                datos.paginas,
                datos.imagen
            );
       
            break;
        case 'libro_Digital':
            nuevoProducto = new Ebook(
                datos.nombre,
                datos.precio,
                datos.descripcion,
                datos.autor,
                datos.isbn,
                datos.paginas,
                datos.tamano,
                datos.imagen
            );
            break;
        case 'ereader':
            nuevoProducto = new Ereader(
                datos.nombre,
                datos.precio,
                datos.descripcion,
                datos.resolucion,
                datos.imagen
            );
            break;
        case 'funda':
            nuevoProducto = new Funda(
                datos.nombre,
                datos.precio,
                datos.descripcion,
                datos.material,
                datos.imagen
            );
            break;
        case 'marcapaginas':
            nuevoProducto = new Marcapaginas(
                datos.nombre,
                datos.precio,
                datos.descripcion,
                datos.color,
                datos.imagen
            );
            break;
        default:
            return false;
    }
    
   
    listaProductos.push(nuevoProducto);

    return true;
}