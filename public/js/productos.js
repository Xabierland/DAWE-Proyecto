// Superclase: Producto
class Producto {
    #id;
    #nombre;
    #precio;
    #descripcion;
    #imagen;

    constructor(nombre, precio, descripcion, imagen) {
        this.#id = this.guidGenerator();
        this.#nombre = nombre;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#imagen = imagen || 'default-image.png';
    }

    guidGenerator() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

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
class Libro extends Producto {
    #ibsn;
    #autor;
    #paginas;

    constructor(nombre, precio, descripcion, autor, ibsn, paginas, imagen) {
        super(nombre, precio, descripcion, imagen);
        this.#ibsn = ibsn;
        this.#autor = autor;
        this.#paginas = paginas;
    }

    get ibsn() {
        return this.#ibsn;
    }

    set ibsn(ibsn) {
        this.#ibsn = ibsn;
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
class Ebook extends Libro {
    #tamano;

    constructor(nombre, precio, descripcion, autor, ibsn, paginas, tamano, imagen) {
        super(nombre, precio, descripcion, autor, ibsn, paginas, imagen);
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
class Ereader extends Producto {
    #resolucion;

    constructor(nombre, precio, descripcion, resolucion, imagen) {
        super(nombre, precio, descripcion, imagen);
        this.#resolucion = resolucion;
    }

    get resolucion() {
        return this.#resolucion;
    }

    set resolucion(resolucion) {
        this.#resolucion = resolucion;
    }
}

// Subclase: Marcapaginas
class Marcapaginas extends Producto {
    #material;

    constructor(nombre, precio, descripcion, material, imagen) {
        super(nombre, precio, descripcion, imagen);
        this.#material = material;
    }

    get material() {
        return this.#material;
    }

    set material(material) {
        this.#material = material;
    }
}
