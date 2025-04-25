#!/bin/bash
set -e

# Esperar a que MongoDB esté listo
echo "Esperando a que MongoDB esté listo..."

# Conectar a MongoDB con las credenciales de administrador
echo "Inicializando base de datos..."
mongosh --host localhost --port 27017 -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin <<'EOF'
// Usar base de datos tienda
db = db.getSiblingDB('tienda');

// Crear colección de Usuarios primero sin validador
db.createCollection("Usuarios");

// Crear colección de Productos primero sin validador
db.createCollection("Productos");

// Insertar usuarios de ejemplo
db.Usuarios.insertMany([
    {
        Nombre: "Admin",
        Email: "admin@example.com",
        Rol: "administrador",
        AnimalFavorito: "Gato",
        LibroFavorito: "1984",
        GeneroFavorito: "Ciencia Ficción"
    },
    {
        Nombre: "Usuario Normal",
        Email: "usuario@example.com",
        Rol: "usuario",
        AnimalFavorito: "Perro",
        LibroFavorito: "El Quijote",
        GeneroFavorito: "Aventura"
    }
]);

print("Usuarios insertados correctamente");

// Insertar productos iniciales
db.Productos.insertMany([
    // ===== LIBROS FÍSICOS =====
    {
        Tipo: "libro_Fisico",
        Nombre: "Los hermanos Karamazov",
        Precio: 15.0,
        Descripcion: "Fiódor Pávlovich Karamázov, un terrateniente borracho, arbitrario y corrompido, tiene cuatro hijos...",
        RutaImagen: "/imagenes/productos/LosHermanosKaramazov.jpg",
        Autor: "Fiódor Mijáilovich Dostoievski",
        Isbn: "9788491050056",
        Paginas: 1144
    },
    {
        Tipo: "libro_Fisico",
        Nombre: "Crimen y castigo",
        Precio: 15.0,
        Descripcion: "Considerada por la crítica como la primera obra maestra de Dostoievski...",
        RutaImagen: "/imagenes/productos/CrimenYCastigo.jpg",
        Autor: "Fiódor Mijáilovich Dostoievski",
        Isbn: "9788491050063",
        Paginas: 746
    },
    {
        Tipo: "libro_Fisico",
        Nombre: "El Idiota",
        Precio: 15.0,
        Descripcion: "La quintaesencia de la novela rusa y una de las cumbres de la narrativa universal...",
        RutaImagen: "/imagenes/productos/ElIdiota.jpg",
        Autor: "Fiódor Mijáilovich Dostoievski",
        Isbn: "9780679642428",
        Paginas: 825
    },
    {
        Tipo: "libro_Fisico",
        Nombre: "El tunel",
        Precio: 6.95,
        Descripcion: "El amor ilimitado truncado por un engaño convertirá el corazón de un hombre en un pedazo de duro y frío hielo...",
        RutaImagen: "/imagenes/productos/ElTunel.jpg",
        Autor: "Ernesto Sabato",
        Isbn: "9788432248368",
        Paginas: 160
    },
    {
        Tipo: "libro_Fisico",
        Nombre: "Viento y verdad",
        Precio: 23,
        Descripcion: "La esperada y explosiva conclusión del primer arco de la saga El Archivo de las Tormentas, obra cumbre de Brandon Sanderson, con más de diez millones de lectores en todo el mundo.",
        RutaImagen: "/imagenes/productos/VientoYVerdad.jpg",
        Autor: "Brandon Sanderson",
        Isbn: "3654166141",
        Paginas: 1400
    },
    {
        Tipo: "libro_Fisico",
        Nombre: "El nombre del viento",
        Precio: 20,
        Descripcion: "Atípica, profunda y sincera, El nombre del viento es una novela de aventuras, de historias dentro de otras historias, de misterio, de amistad, de amor, de magia y de superación. \nLa novela que ha consagrado a Patrick Rothfuss como fenómeno editorial de los últimos años. \nEn una posada en tierra de nadie, un hombre se dispone a relatar, por primera vez, la auténtica historia de su vida. Una historia que únicamente él conoce y que ha quedado diluida tras los rumores, las conjeturas y los cuentos de taberna que le han convertido en un personaje legendario a quien todos daban ya por muerto: Kvothe... músico, mendigo, ladrón, estudiante, mago, héroe y asesino. \nAhora va a revelar la verdad sobre sí mismo. Y para ello debe empezar por el principio: su infancia en una troupe de artistas itinerantes, los años malviviendo como un ladronzuelo en las calles de una gran ciudad y su llegada a una universidad donde esperaba encontrar todas las respuestas que había estado buscando. \n«Viajé, amé, perdí, confié y me traicionaron». \n«He robado princesas a reyes agónicos. Incendié la ciudad de Trebon. He pasado la noche con Felurian y he despertado vivo y cuerdo. Me expulsaron de la Universidad a una edad a la que a la mayoría todavía no los dejan entrar. He recorrido de noche caminos de los que otros no se atreven a hablar ni siquiera de día. He hablado con dioses, he amado a mujeres y he escrito canciones que hacen llorar a los bardos. \nMe llamo Kvothe. Quizá hayas oído hablar de mí».",
        RutaImagen: "/imagenes/productos/ElNombreDelViento.jpg",
        Autor: "Patrick Rothfuss",
        Isbn: "5558675848",
        Paginas: 800
    },    
    
    // ===== LIBROS DIGITALES (EBOOKS) =====
    {
        Tipo: "libro_Digital",
        Nombre: "Dungeon Crawler Carl",
        Precio: 5.0,
        Descripcion: "The apocalypse will be televised! You know what's worse than breaking up with your girlfriend? Being stuck with her prize-winning show cat...",
        RutaImagen: "/imagenes/productos/DungeonCrawlerCarl.jpg",
        Autor: "Matt Dinniman",
        Isbn: "2",
        Paginas: 400,
        Tamano: 300
    },
    {
        Tipo: "libro_Digital",
        Nombre: "El camino de los reyes",
        Precio: 15.0,
        Descripcion: "El camino de los reyes es el primer volumen de «El Archivo de las Tormentas»...",
        RutaImagen: "/imagenes/productos/ElCaminoDeLosReyes.jpg",
        Autor: "Brandon Sanderson",
        Isbn: "6",
        Paginas: 1200,
        Tamano: 500
    },

     {
        Tipo: "libro_Digital",
        Nombre: "Dungeon Crawler Carl: Carl's doomsday scenario",
        Precio: 15.0,
        Descripcion: "The training levels have concluded. Now the games may truly begin. \n The ratings and views are off the chart. The fans just can't get enough. The dungeon gets more dangerous each day. But in a grinder designed to chew up and spit out crawlers by the millions, Carl and Princess Donut need to work harder than ever just to survive. They call it the Over City. A sprawling, once-thriving metropolis devastated by a mysterious calamity. But these streets are far from abandoned. An undead circus trawls the ruins. Murdered prostitutes rain from the sky. An ancient spell is finally ready to reveal its dark purpose. \nCarl still has no pants. \nThey call it Dungeon Crawler World. For Carl and Donut, it's anything but a game.",
        RutaImagen: "/imagenes/productos/DungeonCrawlerCarlCarlsDoomsdayScenario.jpg",
        Autor: "Matt Dinniman",
        Isbn: "7",
        Paginas: 500,
        Tamano: 300
    },

     {
        Tipo: "libro_Digital",
        Nombre: "Palabras radiantes",
        Precio: 15.0,
        Descripcion: "Hace seis años, un asesino mató al rey Alethi, y ahora está asesinando a los gobernantes de todo Roshar; entre sus principales objetivos es Dalinar. Kaladin está al mando de los guardaespaldas reales, un puesto controvertido por su baja condición, y debe proteger al rey y a Dalinar, mientras que en secreto domina nuevos poderes extraordinarios vinculados a Syl. Shallan tiene la carga de impedir el regreso de Voidbringers y el fin de la desolada civilización que queda. Los Parshendi están convencidos por su líder a arriesgarlo todo en una apuesta desesperada con las fuerzas sobrenaturales que una vez desaparecieron.",
        RutaImagen: "/imagenes/productos/PalabrasRadiantes.jpg",
        Autor: "Brandon Sanderson",
        Isbn: "8",
        Paginas: 1300,
        Tamano: 550
    },

    // ===== EREADERS =====
    {
        Tipo: "ereader",
        Nombre: "Kobo clara",
        Precio: 127.0,
        Descripcion: "Lee mucho",
        RutaImagen: "/imagenes/productos/KoboClara.jpg",
        Resolucion: 300
    },
    {
        Tipo: "ereader",
        Nombre: "Kindle Paperwhite",
        Precio: 150.0,
        Descripcion: "Ahora resistente al agua",
        RutaImagen: "/imagenes/productos/KindlePaperwhite.jpg",
        Resolucion: 350
    },
    {
    Tipo: "ereader",
    Nombre: "Kobo Libra",
    Precio: 180.0,
    Descripcion: "Pantalla de alta resolución",
    RutaImagen: "/imagenes/productos/KoboLibra.jpg",
    Resolucion: 400
    },

    // ===== MARCAPÁGINAS =====
    {
        Tipo: "marcapaginas",
        Nombre: "Marcapáginas de cartón",
        Precio: 2.0,
        Descripcion: "Marcapáginas ecológico de cartón reciclado",
        RutaImagen: "/imagenes/productos/MarcapaginasDeCarton.jpg",
        Color: "Cartón"
    },
    {
        Tipo: "marcapaginas",
        Nombre: "Marcapáginas azul",
        Precio: 2.0,
        Descripcion: "Marca las páginas",
        RutaImagen: "/imagenes/productos/MarcapaginasAzul.jpg",
        Color: "Azul"
    },
    {
        Tipo: "marcapaginas",
        Nombre: "Marcapáginas metálico",
        Precio: 5.0,
        Descripcion: "Elegante marcador metálico",
        RutaImagen: "/imagenes/productos/MarcapaginasMetalico.jpg",
        Color: "Plata"
    },

    // ===== FUNDAS =====
    {
        Tipo: "funda",
        Nombre: "Funda Kobo Clara X5",
        Precio: 20.0,
        Descripcion: "Enfunda",
        RutaImagen: "/imagenes/productos/FundaKoboClara.jpg",
        Material: "Wolframio"
    },
    {
        Tipo: "funda",
        Nombre: "Funda Kindle Paperwhite",
        Precio: 20.0,
        Descripcion: "Enfunda",
        RutaImagen: "/imagenes/productos/FundaPaperwhite.jpg",
        Material: "Plastico duro"
    },
    {
    Tipo: "funda",
    Nombre: "Funda Universal",
    Precio: 15.0,
    Descripcion: "Compatible con varios modelos",
    RutaImagen: "/imagenes/productos/FundaUniversal.jpg",
    Material: "Plastico"
    }
]);

print("Productos insertados correctamente");

// Ahora aplicamos los validadores DESPUÉS de insertar los datos
// Modificado para aceptar tanto double como int para el campo Precio
db.runCommand({
    collMod: "Usuarios",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["Nombre", "Email", "Rol"],
            properties: {
                _id: { bsonType: "objectId" },
                Nombre: { bsonType: "string" },
                Email: { bsonType: "string" },
                Rol: { bsonType: "string" },
                AnimalFavorito: { bsonType: "string" },
                LibroFavorito: { bsonType: "string" },
                GeneroFavorito: { bsonType: "string" }
            }
        }
    },
    validationLevel: "moderate"
});

db.runCommand({
    collMod: "Productos",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["Tipo", "Nombre", "Precio", "Descripcion"],
            properties: {
                _id: { bsonType: "objectId" },
                Tipo: { bsonType: "string" },
                Nombre: { bsonType: "string" },
                // Modificado para aceptar tanto double como int para Precio
                Precio: { bsonType: ["double", "int"] },
                Descripcion: { bsonType: "string" },
                RutaImagen: { bsonType: "string" },
                
                // Campos para libros (físicos y digitales)
                Autor: { bsonType: "string" },
                Isbn: { bsonType: "string" },
                Paginas: { bsonType: "int" },
                
                // Campo adicional para libros digitales
                Tamano: { bsonType: "int" },
                
                // Campo para ereaders
                Resolucion: { bsonType: "int" },
                
                // Campo para fundas
                Material: { bsonType: "string" },
                
                // Campo para marcapáginas
                Color: { bsonType: "string" }
            }
        }
    },
    validationLevel: "moderate"
});

// Verificar que las colecciones se hayan creado
print("Colecciones en la base de datos tienda:");
db.getCollectionNames().forEach(function(collectionName) {
    print(" - " + collectionName);
});

// Verificar que los productos se hayan insertado correctamente
print("Número de productos insertados: " + db.Productos.count());
print("Número de usuarios insertados: " + db.Usuarios.count());

// Activar índices para mejorar el rendimiento de búsqueda
db.Productos.createIndex({ Nombre: 1 });
db.Productos.createIndex({ Tipo: 1 });
db.Productos.createIndex({ Precio: 1 });
db.Usuarios.createIndex({ Email: 1 }, { unique: true });

print("Inicialización completada exitosamente");
EOF

echo "Script de inicialización finalizado"