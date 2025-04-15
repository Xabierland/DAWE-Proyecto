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
    }
]);

print("Productos insertados correctamente");

// Ahora aplicamos los validadores DESPUÉS de insertar los datos
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
                Precio: { bsonType: "double" },
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