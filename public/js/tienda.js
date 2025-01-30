/*
4.3. Fichero tienda.js
Se incluirá un fichero llamado tienda.js donde se crearán (manualmente) una serie de productos base que mostraremos en la tienda. 
En concreto, este fichero importará los 5 tipos de clase y creará un array donde añadiremos productos creados a mano. 
Debemos darle valor a todos los atributos. Se deben generar, por lo menos, 3 instancias de cada clase de producto. 
Además, esta lista de productos debe ser exportada para ser usada en otro fichero. 
También se creará y exportará una lista vacía para el carrito de la compra. 

Cualquier otra función relativa a productos se creará y exportará en este fichero. 
Sólo en este fichero se pueden importar las clases de los productos que hemos creado. 
En el resto de ficheros llamaremos a funciones de tienda.js o usaremos las listas de productos y del carrito. 
*/

import {Producto} from './productos.js';




function generarProductos()
{
    let listaProductos = [];

    let libro1 = new Libro("El tunel", 1, "Hay un tunel", "Ernesto Sabato", 35, 100, "img/img.png");


    let libroElectonico1 = new LibroElectronico("Dungeon Crawler Carl", 5, "The apocalypse will be televised", "Matt Dinniman", 34, 400, , imagen);

    let 

    return listaProductos;
}


