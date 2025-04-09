#!/bin/bash
set -e

# Esperar a que MongoDB esté listo
echo "Esperando a que MongoDB esté listo..."

# Conectar a MongoDB con las credenciales de administrador
echo "Inicializando base de datos..."
mongosh --host localhost --port 27017 -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin <<EOF
// Usar base de datos tienda
db = db.getSiblingDB('tienda');

// Crear colección de Usuarios
db.createCollection("Usuarios", {
    validator: {
        \$jsonSchema: {
            bsonType: "object",
            additionalProperties: false,
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
    }
});

// Crear colección de Productos
db.createCollection("Productos", {
    validator: {
        \$jsonSchema: {
            bsonType: "object",
            additionalProperties: false,
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
    }
});

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

// Verificar que las colecciones se hayan creado
print("Colecciones en la base de datos tienda:");
db.getCollectionNames().forEach(function(collectionName) {
    print(" - " + collectionName);
});

print("Inicialización completada exitosamente");
EOF

echo "Script de inicialización finalizado"