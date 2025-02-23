import {Libro, Ebook, Ereader, Marcapaginas, Funda} from './productos.js';

// Lista de productos base
const listaProductos = [
   // Libros Físicos
   new Libro("El tunel", 1, "Hay un tunel", "Ernesto Sabato", 16846984, 100, 'img/productos/ElTunel.jpg'),
   new Libro("Viento y verdad", 5, "Viaje antes que destino", "Brandon Sanderson", 3654166141, 1400, 'img/productos/VientoYVerdad.jpg'),
   new Libro("El nombre del viento", 20, "La historia de un músico, mago y leyenda", "Patrick Rothfuss", 5558675848, 800, 'img/productos/ElNombreDelViento.jpg'),
   
    // Momento de añadir toda la biblioteca de Dostoievski
    new Libro("Los hermanos Karamazov", 15, "Fiódor Pávlovich Karamázov, un terrateniente borracho, arbitrario y corrompido, tiene cuatro hijos: Dmitri, de carácter violento; Iván, un intelectual frío y materialista; Aliosha, el hijo pequeño, pasivo y religioso; y Smerdiakov, el hijo bastardo y resentido. La novela gira en torno a las relaciones perversas que se establecen entre el padre y los hijos hasta que éste es asesinado y su presunto asesino, Dmitri, juzgado y condenado. Odio, amor, crueldad, compasión, sentimientos radicalmente contrarios y enfrentados...", "Fiódor Mijáilovich Dostoievski", 9788491050056, 1144, 'img/productos/LosHermanosKaramazov.jpg'),
    new Libro("Crimen y castigo", 15, "Considerada por la crítica como la primera obra maestra de Dostoievski, Crimen y castigo es un profundo análisis psicológico de su protagonista, el joven estudiante Raskólnikov, cuya firme creencia en que los fines humanitarios justifican la maldad le conduce al asesinato de una usurera. Pero, desde que comete el crimen, la culpabilidad será una pesadilla constante con la que el estudiante será incapaz de convivir.", "Fiódor Mijáilovich Dostoievski", 9788491050063, 746, 'img/productos/CrimenYCastigo.jpg'),
    new Libro("El Idiota", 15, "La quintaesencia de la novela rusa y una de las cumbres de la narrativa universal. Tras retratar magistralmente la figura culpable en Crimen y castigo , Dostoievski ahonda en El idiota en el alma torturada de un hombre inocente. El joven y piadoso príncipe Mishkin regresa a su Rusia natal de un sanatorio suizo donde ha estado varios años para recibir una herencia y «mezclarse con la gente». Sin embargo, en San Petersburgo solo le aguarda una sociedad obsesionada con el dinero, el poder y la manipulación que pondrá a prueba su moral y sus puros sentimientos. Antes de llegar a su destino conoce al inquietante Rogozhin, hijo de un acaudalado mercader, cuya fijación por la hermosa Nastasia Filíppovna acabará por arrastrar a los tres protagonistas a un fatal desenlace.", "Fiódor Mijáilovich Dostoievski", 9780679642428, 825, 'img/productos/ElIdiota.jpg'),
    new Libro("Noches blancas", 15, "San Petersburgo, su luz, sus casas y sus avenidas son el escenario de esta apasionada novela. En una de esas «noches blancas» que se dan en la ciudad rusa durante la época del solsticio de verano, un joven solitario e introvertido narra cómo conoce de forma accidental a una muchacha a la orilla del canal. Tras el primer encuentro, la pareja de desconocidos se citará las tres noches siguientes, noches en las que ella, de nombre Nástenka, relatará su triste historia y en las que harán acto de presencia, de forma sutil y envolvente, las grandes pasiones que mueven al ser humano: el amor, la ilusión, la esperanza, el desamor, el desengaño.", "Fiódor Mijáilovich Dostoievski", 9788416440047, 128, 'img/productos/NochesBlancas.jpg'),
    new Libro("Apuntes del subsuelo", 15, "Apuntes del subsuelo es el testimonio de un cualquiera –o, lo que es lo mismo, de todos y cada uno de nosotros– que, alienado socialmente y paralizado por su propia insignificancia, cuenta la historia de su torturada vida. Con amarga ironía, describe su negativa a convertirse en un trabajador en el «hormiguero» de la sociedad y su retiro gradual a una existencia marginada, irracional e incomprendida.Esta obra maestra de la literatura universal publicada en 1864, aunque pieza breve, es fundamental para comprender el espíritu dolorido y pesimista del errante Dostoievski. Organizada en dos partes, la primera consta básicamente de un monólogo interior del protagonista que dirige su charla a un público inexistente. La segunda parte consiste en el relato de una larga memoria del narrador, donde adquieren pleno sentido los pensamientos expresados al comienzo. El hombre del subsuelo resultará un paradigma inequívoco de muchos de los antihéroes y fuente de la que beben las historias que dominarán la novela del siglo xx.", "Fiódor Mijáilovich Dostoievski", 9788408285151, 192, 'img/productos/ApuntesDelSubsuelo.jpg'),
    new Libro("El jugador", 15, "El jugador documenta el descenso a los infiernos de la adicción al juego, de la expatriación forzosa y de los amores destructivos e imposibles. Dostoyevski nunca incorporó tantos elementos autobiográficos a una novela suya, lo cual la hace más terrible y descorazonadora, si cabe. El jugador es una novela intensa, apasionante y repleta de humor. Sin duda, una de las cumbres literarias del realismo psicológico ruso.", "Fiódor Mijáilovich Dostoievski", 9788418395123, 192, 'img/productos/ElJugador.jpg'),
    new Libro("La sumisa", 15, "'Imagínense a un marido que tiene ante sí, sobre la mesa, a su esposa, la cual se ha suicidado arrojándose por la ventana. El marido se encuentra aún aturdido, todavía no ha tenido tiempo de concentrarse. Va y viene por las habitaciones de su casa esforzándose por hacerse cargo de lo ocurrido, por 'fijar su pensamiento en un punto'. Además, es un hipocondríaco empedernido, de los que hablan consigo mismo. También en ese momento está hablando solo, cuenta lo sucedido, se lo aclara. A pesar de la aparente trabazón de su discurso, se contradice varias veces a sí mismo, tanto por lo que respecta a la lógica como a los sentimientos. Se justifica, la acusa a ella y se sume en explicaciones tangenciales en las que la vulgaridad de ideas y afectos se junta a la hondura de pensamiento. Poco a poco va aclarando lo ocurrido y concentrando 'los pensamientos en un punto'. Varios de los recuerdos evocados le llevan por fin a la verdad, la cual, quiera o no, eleva su entendimiento y su corazón. Al final cambia incluso el tono del relato, si se compara con el desorden del comienzo. El desdichado descubre la verdad bastante clara y de perfiles concretos, por lo menos para sí mismo.' Es así como Dostoyevski se dirige a sus lectores para introducirles La sumisa, publicada en 1876, uno de los últimos relatos surgidos de la pluma del gran escritor ruso, mientras trabajaba en la que sería su última novela Los hermanos Karamázov. La publicamos ahora en castellano recuperando la espléndida traducción de Juan Luis Abollado.", "Fiódor Mijáilovich Dostoievski", 9788419075789, 112, 'img/productos/LaSumisa.jpg'),

    // Libros Electrónicos
    new Ebook("Dungeon Crawler Carl", 5, "The apocalypse will be televised", "Matt Dinniman", 2, 400, 300, 'img/productos/DungeonCrawlerCarl.jpg'),
    new Ebook("Dungeon Crawler Carl: Carl's doomsday scenario", 6, "The apocalypse will be televised", "Matt Dinniman", 4, 500, 300, 'img/productos/DungeonCrawlerCarlCarlsDoomsdayScenario.jpg'),
    new Ebook("El camino de los reyes", 15, "La historia de Kaladin", "Brandon Sanderson", 6, 1200, 500, 'img/productos/ElCaminoDeLosReyes.jpg'),
    new Ebook("Palabras radiantes", 15, "La historia de Shallan", "Brandon Sanderson", 7, 1300, 550, 'img/productos/PalabrasRadiantes.jpg'),

    // Ereaders
    new Ereader("Kobo clara", 127, "Lee mucho", 300, 'img/productos/KoboClara.jpg'),
    new Ereader("Kindle Paperwhite", 150, "Ahora resistente al agua", 350, 'img/productos/KindlePaperwhite.jpg'),
    new Ereader("Kobo Libra", 180, "Pantalla de alta resolución", 400, 'img/productos/KoboLibra.jpg'),

    // Marcapáginas
    new Marcapaginas("Marcapáginas de cartón", 2, "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure", "Cartón", 'img/productos/MarcapaginasDeCarton.jpg'),
    new Marcapaginas("Marcapáginas azul", 2, "Marca las páginas", "Azul", 'img/productos/MarcapaginasAzul.jpg'),
    new Marcapaginas("Marcapáginas metálico", 5, "Elegante marcador metálico", "Plata", 'img/productos/MarcapaginasMetalico.jpg'),

    // Fundas
    new Funda("Funda Kobo Clara X5", 20, "Enfunda", "Wolframio", 'img/productos/FundaKoboClara.jpg'),
    new Funda("Funda Kindle Paperwhite", 20, "Enfunda", "Plastico duro", 'img/productos/KindlePaperwhite.jpg'),
    new Funda("Funda Universal", 15, "Compatible con varios modelos", "Plastico", 'img/productos/FundaUniversal.jpg')
];

const carrito = new Map();

// === Funciones de productos ===
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

//  === Funciones de carrito ===
export function obtenerCarrito() {
    return carrito;
}

// DEBUG
//export function imprimirCarrito() {
//    console.log(carrito);
//}