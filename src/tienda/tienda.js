import {Libro, Ebook, Ereader, Marcapaginas, Funda} from './productos.js';

// Constantes requeridas
export const DIVISA = '€';
export const MAX_COPIAS = 20;

// Lista de productos base
export const listaProductos = [
    // Momento de añadir toda la biblioteca de Dostoievski
    // by Xabier Gabiña
    new Libro("Los hermanos Karamazov", 15, "Fiódor Pávlovich Karamázov, un terrateniente borracho, arbitrario y corrompido, tiene cuatro hijos: Dmitri, de carácter violento; Iván, un intelectual frío y materialista; Aliosha, el hijo pequeño, pasivo y religioso; y Smerdiakov, el hijo bastardo y resentido. La novela gira en torno a las relaciones perversas que se establecen entre el padre y los hijos hasta que éste es asesinado y su presunto asesino, Dmitri, juzgado y condenado. Odio, amor, crueldad, compasión, sentimientos radicalmente contrarios y enfrentados...", "Fiódor Mijáilovich Dostoievski", 9788491050056, 1144, 'imagenes/productos/LosHermanosKaramazov.jpg'),
    new Libro("Crimen y castigo", 15, "Considerada por la crítica como la primera obra maestra de Dostoievski, Crimen y castigo es un profundo análisis psicológico de su protagonista, el joven estudiante Raskólnikov, cuya firme creencia en que los fines humanitarios justifican la maldad le conduce al asesinato de una usurera. Pero, desde que comete el crimen, la culpabilidad será una pesadilla constante con la que el estudiante será incapaz de convivir.", "Fiódor Mijáilovich Dostoievski", 9788491050063, 746, 'imagenes/productos/CrimenYCastigo.jpg'),
    new Libro("El Idiota", 15, "La quintaesencia de la novela rusa y una de las cumbres de la narrativa universal. Tras retratar magistralmente la figura culpable en Crimen y castigo , Dostoievski ahonda en El idiota en el alma torturada de un hombre inocente. El joven y piadoso príncipe Mishkin regresa a su Rusia natal de un sanatorio suizo donde ha estado varios años para recibir una herencia y «mezclarse con la gente». Sin embargo, en San Petersburgo solo le aguarda una sociedad obsesionada con el dinero, el poder y la manipulación que pondrá a prueba su moral y sus puros sentimientos. Antes de llegar a su destino conoce al inquietante Rogozhin, hijo de un acaudalado mercader, cuya fijación por la hermosa Nastasia Filíppovna acabará por arrastrar a los tres protagonistas a un fatal desenlace.", "Fiódor Mijáilovich Dostoievski", 9780679642428, 825, 'imagenes/productos/ElIdiota.jpg'),
    
    // Libros Físicos
    new Libro("El tunel", 6.95, "El amor ilimitado truncado por un engaño convertirá el corazón de un hombre en un pedazo de duro y frío hielo y colocará en sus manos el cuchillo que pone final al sufrimiento. Sabato nos entrega los elementos básicos de su visión metafísica del existir.", "Ernesto Sabato", 9788432248368, 160, 'imagenes/productos/ElTunel.jpg'),
    new Libro("Viento y verdad", 5, "La esperada y explosiva conclusión del primer arco de la saga El Archivo de las Tormentas, obra cumbre de Brandon Sanderson, con más de diez millones de lectores en todo el mundo.", "Brandon Sanderson", 3654166141, 1400, 'imagenes/productos/VientoYVerdad.jpg'),
    new Libro("El nombre del viento", 20, "Atípica, profunda y sincera, El nombre del viento es una novela de aventuras, de historias dentro de otras historias, de misterio, de amistad, de amor, de magia y de superación.", "Patrick Rothfuss", 5558675848, 800, 'imagenes/productos/ElNombreDelViento.jpg'),
    
    // Libros Electrónicos
    new Ebook("Dungeon Crawler Carl", 5, "The apocalypse will be televised! You know what's worse than breaking up with your girlfriend? Being stuck with her prize-winning show cat.", "Matt Dinniman", 2, 400, 300, 'imagenes/productos/DungeonCrawlerCarl.jpg'),
    new Ebook("El camino de los reyes", 15, "El camino de los reyes es el primer volumen de «El Archivo de las Tormentas», el resultado de más de una década de construcción y escritura de universos, convertido en una obra maestra de la fantasía contemporánea en diez volúmenes.", "Brandon Sanderson", 6, 1200, 500, 'imagenes/productos/ElCaminoDeLosReyes.jpg'),
    new Ebook("Palabras radiantes", 15, "Hace seis años, un asesino mató al rey Alethi, y ahora está asesinando a los gobernantes de todo Roshar; entre sus principales objetivos es Dalinar.", "Brandon Sanderson", 7, 1300, 550, 'imagenes/productos/PalabrasRadiantes.jpg'),

    // Ereaders
    new Ereader("Kobo clara", 127, "Lee mucho", 300, 'imagenes/productos/KoboClara.jpg'),
    new Ereader("Kindle Paperwhite", 150, "Ahora resistente al agua", 350, 'imagenes/productos/KindlePaperwhite.jpg'),
    new Ereader("Kobo Libra", 180, "Pantalla de alta resolución", 400, 'imagenes/productos/KoboLibra.jpg'),

    // Marcapáginas
    new Marcapaginas("Marcapáginas de cartón", 2, "Marca las páginas con estilo", "Cartón", 'imagenes/productos/MarcapaginasDeCarton.jpg'),
    new Marcapaginas("Marcapáginas azul", 2, "Marca las páginas", "Azul", 'imagenes/productos/MarcapaginasAzul.jpg'),
    new Marcapaginas("Marcapáginas metálico", 5, "Elegante marcador metálico", "Plata", 'imagenes/productos/MarcapaginasMetalico.jpg'),

    // Fundas
    new Funda("Funda Kobo Clara X5", 20, "Protege tu Kobo Clara", "Wolframio", 'imagenes/productos/FundaKoboClara.jpg'),
    new Funda("Funda Kindle Paperwhite", 20, "Protege tu Kindle", "Plastico duro", 'imagenes/productos/FundaKindlePaperwhite.jpg'),
    new Funda("Funda Universal", 15, "Compatible con varios modelos", "Plastico", 'imagenes/productos/FundaUniversal.jpg')
];

// Funciones para gestionar el carrito en localStorage
export const guardarEnCarrito = (productId, item) => {
    try {
        localStorage.setItem(`producto_${productId}`, JSON.stringify(item));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
};

export const borrarDelCarrito = (productId) => {
    try {
        localStorage.removeItem(`producto_${productId}`);
    } catch (error) {
        console.error('Error al borrar del localStorage:', error);
    }
};

export const cargarCarrito = () => {
    const carritoTemporal = [];
    try {
        // Obtener todas las claves de localStorage
        const keys = Object.keys(localStorage);
        
        // Filtrar solo las claves que comienzan con 'producto_'
        const productoKeys = keys.filter(key => key.startsWith('producto_'));
        
        // Recorrer las claves y añadir al carrito
        productoKeys.forEach(key => {
            const item = JSON.parse(localStorage.getItem(key));
            const productId = key.replace('producto_', '');
            carritoTemporal.push({
                id: productId,
                ...item
            });
        });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
    
    return carritoTemporal;
};

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