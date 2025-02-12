/*
4.1.1. Producto
La clase Producto es una superclase de la que heredarán todos los productos de la tienda.
Debe tener métodos setter y getter (implementados mediante las palabras clave set y get de ES5-6) de todos sus atributos. 
Los atributos deben ser privados (utiliza la sintaxis de ES2022). 
Deben incluirse como atributos:

ID del producto.
Nombre del producto.
Precio del producto.
Descripción del producto.
Imagen del producto.

El ID NO tiene que tener un setter, solo un getter. 
Al instanciar un producto, se le asignará automáticamente un ID único y no podrá ser modificado de ninguna manera. 
Puedes usar la siguiente función para generar dicho ID:

function guidGenerator() {
	var S4 = function() {
   	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


En caso de que la imagen sea null (porque no la hemos metido), se debe de poner una imagen predefinida indicando la ausencia de imagen.
*/

// Superclase: Producto
class Producto {
    #id;
    #nombre;
    #precio;
    #descripcion;
    #imagen;
    #tipo;

    constructor(nombre, precio, descripcion, imagen, tipo) {
        this.#id = this.guidGenerator();
        this.#nombre = nombre;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#imagen = imagen || '/img/default.png';
        this.#tipo = tipo;
    }

    guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    get tipo() {
        return this.#tipo;
    }

    // Resto de getters y setters se mantienen igual
    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    set nombre(nombre) {
        this.#nombre = nombre;
    }

    get precio() {
        return this.#precio;
    }

    set precio(precio) {
        this.#precio = precio;
    }

    get descripcion() {
        return this.#descripcion;
    }

    set descripcion(descripcion) {
        this.#descripcion = descripcion;
    }

    get imagen() {
        return this.#imagen;
    }

    set imagen(imagen) {
        this.#imagen = imagen || 'default-image.png';
    }
}

// Subclase: Libro fisico
export class Libro extends Producto {
    #isbn;
    #autor;
    #paginas;

    constructor(nombre, precio, descripcion, autor, isbn, paginas, imagen) {
        super(nombre, precio, descripcion, imagen, 'libro_Fisico');
        this.#isbn = isbn;
        this.#autor = autor;
        this.#paginas = paginas;
    }

    get isbn() {
        return this.#isbn;
    }

    set isbn(isbn) {
        this.#isbn = isbn;
    }

    get autor() {
        return this.#autor;
    }

    set autor(autor) {
        this.#autor = autor;
    }

    get paginas() {
        return this.#paginas;
    }

    set paginas(paginas) {
        this.#paginas = paginas;
    }
}

// Subclase: Libro electronico
export class Ebook extends Libro {
    #tamano;

    constructor(nombre, precio, descripcion, autor, isbn, paginas, tamano, imagen) {
        super(nombre, precio, descripcion, imagen, 'libro_Digital');
        this.#tamano = tamano;
    }

    get tamano() {
        return this.#tamano;
    }

    set tamano(tamano) {
        this.#tamano = tamano;
    }
}

// Subclase: Ereader
export class Ereader extends Producto {
    #resolucion;

    constructor(nombre, precio, descripcion, resolucion, imagen) {
        super(nombre, precio, descripcion, imagen, 'ereader');
        this.#resolucion = resolucion;
    }

    get resolucion() {
        return this.#resolucion;
    }

    set resolucion(resolucion) {
        this.#resolucion = resolucion;
    }
}

// Subclase: Funda Ereader
export class Funda extends Producto {
    #material;

    constructor(nombre, precio, descripcion, material, imagen) {
        super(nombre, precio, descripcion, imagen, 'funda');
        this.#material = material;
    }

    get material() {
        return this.#material;
    }

    set material(material) {
        this.#material = material;
    }
}

// Subclase: Marcapaginas
export class Marcapaginas extends Producto {
    #color;

    constructor(nombre, precio, descripcion, color, imagen) {
        super(nombre, precio, descripcion, imagen, 'marcapaginas');
        this.#color = color;
    }

    get color() {
        return this.#color;
    }

    set color(color) {
        this.#color = color;
    }
}
