import {Libro, Ebook, Ereader, Marcapaginas, Funda} from './productos.js';

// Lista de productos base
const listaProductos = [
   // Libros Físicos
   new Libro("El tunel", 1, "Hay un tunel", "Ernesto Sabato", 1, 100, "img/img1.png"),
   new Libro("Viento y verdad", 5, "Viaje antes que destino", "Brandon Sanderson", 3, 1400, "img/img5.png"),
   new Libro("El nombre del viento", 20, "La historia de un músico, mago y leyenda", "Patrick Rothfuss", 5, 800, "img/img10.png"),

   // Libros Electrónicos
   new Ebook("Dungeon Crawler Carl", 5, "The apocalypse will be televised", "Matt Dinniman", 2, 400, 300, "img/img2.png"),
   new Ebook("Dungeon Crawler Carl: Carl's doomsday scenario", 6, "The apocalypse will be televised", "Matt Dinniman", 4, 500, 300, "img/img6.png"),
   new Ebook("El camino de los reyes", 15, "La historia de Kaladin", "Brandon Sanderson", 6, 1200, 500, "img/img11.png"),
   new Ebook("Palabras radiantes", 15, "La historia de Shallan", "Brandon Sanderson", 7, 1300, 550, "img/img15.png"),

   // Ereaders
   new Ereader("Kobo clara", 127, "Lee mucho", 300, "img/img3.png"),
   new Ereader("Kindle Paperwhite", 150, "Ahora resistente al agua", 350, "img/img7.png"),
   new Ereader("Kobo Libra", 180, "Pantalla de alta resolución", 400, "img/img12.png"),

   // Marcapáginas
   new Marcapaginas("Marcapáginas de cartón", 2, "Marca las páginas", "Cartón", "img/img3.png"),
   new Marcapaginas("Marcapáginas azul", 2, "Marca las páginas", "Azul", "img/img8.png"),
   new Marcapaginas("Marcapáginas metálico", 5, "Elegante marcador metálico", "Plata", "img/img13.png"),

   // Fundas
   new Funda("Funda Kobo Clara X5", 20, "Enfunda", "Wolframio", "img/img4.png"),
   new Funda("Funda Kindle Paperwhite", 20, "Enfunda", "Plastico duro", "img/img9.png"),
   new Funda("Funda Universal", 15, "Compatible con varios modelos", "Cuero", "img/img14.png")
];

// Funciones de productos
export function obtenerProductos() {
   return listaProductos;
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