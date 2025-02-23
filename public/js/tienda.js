import {Libro, Ebook, Ereader, Marcapaginas, Funda} from './productos.js';

// Lista de productos base
export const listaProductos = [
    // Momento de añadir toda la biblioteca de Dostoievski
    // by Xabier Gabiña
    new Libro("Los hermanos Karamazov", 15, "Fiódor Pávlovich Karamázov, un terrateniente borracho, arbitrario y corrompido, tiene cuatro hijos: Dmitri, de carácter violento; Iván, un intelectual frío y materialista; Aliosha, el hijo pequeño, pasivo y religioso; y Smerdiakov, el hijo bastardo y resentido. La novela gira en torno a las relaciones perversas que se establecen entre el padre y los hijos hasta que éste es asesinado y su presunto asesino, Dmitri, juzgado y condenado. Odio, amor, crueldad, compasión, sentimientos radicalmente contrarios y enfrentados...", "Fiódor Mijáilovich Dostoievski", 9788491050056, 1144, 'img/productos/LosHermanosKaramazov.jpg'),
    new Libro("Crimen y castigo", 15, "Considerada por la crítica como la primera obra maestra de Dostoievski, Crimen y castigo es un profundo análisis psicológico de su protagonista, el joven estudiante Raskólnikov, cuya firme creencia en que los fines humanitarios justifican la maldad le conduce al asesinato de una usurera. Pero, desde que comete el crimen, la culpabilidad será una pesadilla constante con la que el estudiante será incapaz de convivir.", "Fiódor Mijáilovich Dostoievski", 9788491050063, 746, 'img/productos/CrimenYCastigo.jpg'),
    new Libro("El Idiota", 15, "La quintaesencia de la novela rusa y una de las cumbres de la narrativa universal. Tras retratar magistralmente la figura culpable en Crimen y castigo , Dostoievski ahonda en El idiota en el alma torturada de un hombre inocente. El joven y piadoso príncipe Mishkin regresa a su Rusia natal de un sanatorio suizo donde ha estado varios años para recibir una herencia y «mezclarse con la gente». Sin embargo, en San Petersburgo solo le aguarda una sociedad obsesionada con el dinero, el poder y la manipulación que pondrá a prueba su moral y sus puros sentimientos. Antes de llegar a su destino conoce al inquietante Rogozhin, hijo de un acaudalado mercader, cuya fijación por la hermosa Nastasia Filíppovna acabará por arrastrar a los tres protagonistas a un fatal desenlace.", "Fiódor Mijáilovich Dostoievski", 9780679642428, 825, 'img/productos/ElIdiota.jpg'),
    new Libro("Noches blancas", 18, "San Petersburgo, su luz, sus casas y sus avenidas son el escenario de esta apasionada novela. En una de esas «noches blancas» que se dan en la ciudad rusa durante la época del solsticio de verano, un joven solitario e introvertido narra cómo conoce de forma accidental a una muchacha a la orilla del canal. Tras el primer encuentro, la pareja de desconocidos se citará las tres noches siguientes, noches en las que ella, de nombre Nástenka, relatará su triste historia y en las que harán acto de presencia, de forma sutil y envolvente, las grandes pasiones que mueven al ser humano: el amor, la ilusión, la esperanza, el desamor, el desengaño.", "Fiódor Mijáilovich Dostoievski", 9788416440047, 128, 'img/productos/NochesBlancas.jpg'),
    new Libro("Apuntes del subsuelo", 15, "Apuntes del subsuelo es el testimonio de un cualquiera o, lo que es lo mismo, de todos y cada uno de nosotros que, alienado socialmente y paralizado por su propia insignificancia, cuenta la historia de su torturada vida. Con amarga ironía, describe su negativa a convertirse en un trabajador en el «hormiguero» de la sociedad y su retiro gradual a una existencia marginada, irracional e incomprendida.Esta obra maestra de la literatura universal publicada en 1864, aunque pieza breve, es fundamental para comprender el espíritu dolorido y pesimista del errante Dostoievski. Organizada en dos partes, la primera consta básicamente de un monólogo interior del protagonista que dirige su charla a un público inexistente. La segunda parte consiste en el relato de una larga memoria del narrador, donde adquieren pleno sentido los pensamientos expresados al comienzo. El hombre del subsuelo resultará un paradigma inequívoco de muchos de los antihéroes y fuente de la que beben las historias que dominarán la novela del siglo xx.", "Fiódor Mijáilovich Dostoievski", 9788408285151, 192, 'img/productos/ApuntesDelSubsuelo.jpg'),
    new Libro("El jugador", 15, "El jugador documenta el descenso a los infiernos de la adicción al juego, de la expatriación forzosa y de los amores destructivos e imposibles. Dostoyevski nunca incorporó tantos elementos autobiográficos a una novela suya, lo cual la hace más terrible y descorazonadora, si cabe. El jugador es una novela intensa, apasionante y repleta de humor. Sin duda, una de las cumbres literarias del realismo psicológico ruso.", "Fiódor Mijáilovich Dostoievski", 9788418395123, 192, 'img/productos/ElJugador.jpg'),
    new Libro("La sumisa", 10, "'Imagínense a un marido que tiene ante sí, sobre la mesa, a su esposa, la cual se ha suicidado arrojándose por la ventana. El marido se encuentra aún aturdido, todavía no ha tenido tiempo de concentrarse. Va y viene por las habitaciones de su casa esforzándose por hacerse cargo de lo ocurrido, por 'fijar su pensamiento en un punto'. Además, es un hipocondríaco empedernido, de los que hablan consigo mismo. También en ese momento está hablando solo, cuenta lo sucedido, se lo aclara. A pesar de la aparente trabazón de su discurso, se contradice varias veces a sí mismo, tanto por lo que respecta a la lógica como a los sentimientos. Se justifica, la acusa a ella y se sume en explicaciones tangenciales en las que la vulgaridad de ideas y afectos se junta a la hondura de pensamiento. Poco a poco va aclarando lo ocurrido y concentrando 'los pensamientos en un punto'. Varios de los recuerdos evocados le llevan por fin a la verdad, la cual, quiera o no, eleva su entendimiento y su corazón. Al final cambia incluso el tono del relato, si se compara con el desorden del comienzo. El desdichado descubre la verdad bastante clara y de perfiles concretos, por lo menos para sí mismo.' Es así como Dostoyevski se dirige a sus lectores para introducirles La sumisa, publicada en 1876, uno de los últimos relatos surgidos de la pluma del gran escritor ruso, mientras trabajaba en la que sería su última novela Los hermanos Karamázov. La publicamos ahora en castellano recuperando la espléndida traducción de Juan Luis Abollado.", "Fiódor Mijáilovich Dostoievski", 9788419075789, 112, 'img/productos/LaSumisa.jpg'),
    new Libro("El eterno marido", 12, "Esta novela, aparecida en 1870, gira en torno al ya clásico conflicto que surge del triángulo marido-esposa-amante, aunque bajo el particular prisma del universal escritor ruso. En efecto, situando a la mujer por distintos medios como polo nebuloso, aunque no por ello menos atractivo, la obra profundiza en el motivo centrándose en la ambivalente relación de atracción y repulsión que experimentan Pável Pávlovich Trusotski hombre nacido con la vocación irrefrenable de ser eterna y necesariamente marido, y marido burlado, por más señas y Velchanínov un Don Juan neurasténico e irresoluto, quien, por no ser enteramente ajeno al sentimentalismo, se desvía en gran medida del clásico burlador, y en los efectos tragicómicos que resultan de tal relación.", "Fiódor Mijáilovich Dostoievski", 9788420678184, 232, 'img/productos/ElEternoMarido.jpg'),
    new Libro("El sueño del tío", 12, "El sueño del tío se inscribe dentro de la producción del Dostoyevski sarcástico y burlón que, al igual que en novelas como La aldea de Stepánchikovo y sus moradores o El eterno marido, ambas publicadas en esta colección, satiriza segmentos sociales y tipos corrientes en la sociedad de su tiempo. Situada en una pequeña ciudad de provincias, la acción gira en torno a la despótica María Alexándrovna, una de sus principales señoras, quien, con motivo de la inesperada aparición en sus dominios de un noble senil y grotesco -el tío al que hace referencia el título de la obra- y la arbitraria relación que entabla con el simple pretendiente de su hija, ve la oportunidad de ascender social y económicamente y hacerse un lugar en la alta sociedad de San Petersburgo. Dostoyevski retrata con humor una sociedad mediocre que rigen como principales motores la intriga, el cotilleo, el mezquino afán de revancha, el ansia de poder y la hipocresía.", "Fiódor Mijáilovich Dostoievski", 9788411485920, 216, 'img/productos/ElSuenoDelTio.jpg'),
    new Libro("El sueño de un hombre rdículo", 11.35, "Ensombrecidos por el enorme calado de sus novelas, los tres cuentos que se reúnen en este volumen son, sin embargo, tres piezas sobresalientes características del Dostoyevski más maduro. Aunque en cada uno de ellos predomine un registro distinto -metafórico en El sueño de un hombre ridículo, satírico en Bobok, trágico en La sumisa, todos giran en torno a dos de las preocupaciones mayores del autor, a saber: por un lado, la insensibilidad de la que el hombre es víctima a causa de su enajenación respecto a sus raíces, y por otro el sentido de su andadura sobre la tierra. Traducción de Natalia Dvórkina", "Fiódor Mijáilovich Dostoievski", 8420664545, 160, 'img/productos/ElSuenoDeUnHombreRidiculo.jpg'),

    // Libros Físicos
    new Libro("El tunel", 6.95, "El amor ilimitado truncado por un engaño convertirá el corazón de un hombre en un pedazo de duro y frío hielo y colocará en sus manos el cuchillo que pone final al sufrimiento. Sabato nos entrega los elementos básicos de su visión metafísica del existir.", "Ernesto Sabato", 9788432248368, 160, 'img/productos/ElTunel.jpg'),
    new Libro("Viento y verdad", 5, "La esperada y explosiva conclusión del primer arco de la saga El Archivo de las Tormentas, obra cumbre de Brandon Sanderson, con más de diez millones de lectores en todo el mundo.", "Brandon Sanderson", 3654166141, 1400, 'img/productos/VientoYVerdad.jpg'),
    new Libro("El nombre del viento", 20, "Atípica, profunda y sincera, El nombre del viento es una novela de aventuras, de historias dentro de otras historias, de misterio, de amistad, de amor, de magia y de superación. \nLa novela que ha consagrado a Patrick Rothfuss como fenómeno editorial de los últimos años. \nEn una posada en tierra de nadie, un hombre se dispone a relatar, por primera vez, la auténtica historia de su vida. Una historia que únicamente él conoce y que ha quedado diluida tras los rumores, las conjeturas y los cuentos de taberna que le han convertido en un personaje legendario a quien todos daban ya por muerto: Kvothe... músico, mendigo, ladrón, estudiante, mago, héroe y asesino. \nAhora va a revelar la verdad sobre sí mismo. Y para ello debe empezar por el principio: su infancia en una troupe de artistas itinerantes, los años malviviendo como un ladronzuelo en las calles de una gran ciudad y su llegada a una universidad donde esperaba encontrar todas las respuestas que había estado buscando. \n«Viajé, amé, perdí, confié y me traicionaron». \n«He robado princesas a reyes agónicos. Incendié la ciudad de Trebon. He pasado la noche con Felurian y he despertado vivo y cuerdo. Me expulsaron de la Universidad a una edad a la que a la mayoría todavía no los dejan entrar. He recorrido de noche caminos de los que otros no se atreven a hablar ni siquiera de día. He hablado con dioses, he amado a mujeres y he escrito canciones que hacen llorar a los bardos. \nMe llamo Kvothe. Quizá hayas oído hablar de mí».", "Patrick Rothfuss", 5558675848, 800, 'img/productos/ElNombreDelViento.jpg'),
    
    
    // Libros Electrónicos
    new Ebook("Dungeon Crawler Carl", 5, "The apocalypse will be televised! You know what’s worse than breaking up with your girlfriend? Being stuck with her prize-winning show cat. And you know what’s worse than that? An alien invasion, the destruction of all man-made structures on Earth, and the systematic exploitation of all the survivors for a sadistic intergalactic game show. That’s what. \nJoin Coast Guard vet Carl and his ex-girlfriend’s cat, Princess Donut, as they try to survive the end of the world—or just get to the next level—in a video game–like, trap-filled fantasy dungeon. A dungeon that’s actually the set of a reality television show with countless viewers across the galaxy. Exploding goblins. Magical potions. Deadly, drug-dealing llamas. This ain’t your ordinary game show.", "Matt Dinniman", 2, 400, 300, 'img/productos/DungeonCrawlerCarl.jpg'),
    new Ebook("Dungeon Crawler Carl: Carl's doomsday scenario", 6, "The training levels have concluded. Now the games may truly begin. \n The ratings and views are off the chart. The fans just can't get enough. The dungeon gets more dangerous each day. But in a grinder designed to chew up and spit out crawlers by the millions, Carl and Princess Donut need to work harder than ever just to survive. They call it the Over City. A sprawling, once-thriving metropolis devastated by a mysterious calamity. But these streets are far from abandoned. An undead circus trawls the ruins. Murdered prostitutes rain from the sky. An ancient spell is finally ready to reveal its dark purpose. \nCarl still has no pants. \nThey call it Dungeon Crawler World. For Carl and Donut, it's anything but a game.", "Matt Dinniman", 4, 500, 300, 'img/productos/DungeonCrawlerCarlCarlsDoomsdayScenario.jpg'),
    new Ebook("El camino de los reyes", 15, "El camino de los reyes es el primer volumen de «El Archivo de las Tormentas», el resultado de más de una década de construcción y escritura de universos, convertido en una obra maestra de la fantasía contemporánea en diez volúmenes. Con ella, Brandon Sanderson se postula como el autor del género que más lectores está ganando en todo el mundo. Anhelo los días previos a la Última Desolación. Los días en que los Heraldos nos abandonaron y los Caballeros Radiantes se giraron en nuestra contra. Un tiempo en que aún había magia en el mundo y honor en el corazón de los hombres. El mundo fue nuestro, pero lo perdimos. Probablemente no hay nada más estimulante para las almas de los hombres que la victoria. ¿O tal vez fue la victoria una ilusión durante todo ese tiempo? ¿Comprendieron nuestros enemigos que cuanto más duramente luchaban, más resistíamos nosotros? Quizá vieron que el fuego y el martillo tan solo producían mejores espadas. Pero ignoraron el acero durante el tiempo suficiente para oxidarse. Hay cuatro personas a las que observamos. La primera es el médico, quien dejó de curar para convertirse en soldado durante la guerra más brutal de nuestro tiempo. La segunda es el asesino, un homicida que llora siempre que mata. La tercera es la mentirosa, una joven que viste un manto de erudita sobre un corazón de ladrona. Por último está el alto príncipe, un guerrero que mira al pasado mientras languidece su sed de guerra. El mundo puede cambiar. La potenciación y el uso de las esquirlas pueden aparecer de nuevo, la magia de los días pasados puede volver a ser nuestra. Esas cuatro personas son la clave. Una de ellas nos redimirá. Y una de ellas nos destruirá. Reseñas: «Brandon Sanderson es una leyenda.» Alexelcapo", "Brandon Sanderson", 6, 1200, 500, 'img/productos/ElCaminoDeLosReyes.jpg'),
    new Ebook("Palabras radiantes", 15, "Hace seis años, un asesino mató al rey Alethi, y ahora está asesinando a los gobernantes de todo Roshar; entre sus principales objetivos es Dalinar. Kaladin está al mando de los guardaespaldas reales, un puesto controvertido por su baja condición, y debe proteger al rey y a Dalinar, mientras que en secreto domina nuevos poderes extraordinarios vinculados a Syl. Shallan tiene la carga de impedir el regreso de Voidbringers y el fin de la desolada civilización que queda. Los Parshendi están convencidos por su líder a arriesgarlo todo en una apuesta desesperada con las fuerzas sobrenaturales que una vez desaparecieron.", "Brandon Sanderson", 7, 1300, 550, 'img/productos/PalabrasRadiantes.jpg'),

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

export const carrito = new Map();

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

// DEBUG
export function imprimirCarrito() {
    console.log(carrito);
}