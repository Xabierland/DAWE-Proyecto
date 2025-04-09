// Usar la base de datos "tienda"
db = db.getSiblingDB('tienda');

// Crear colección de Usuarios con validación
db.createCollection("Usuarios", {
    validator: {
        $jsonSchema: {
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

// Crear colección de Productos con validación
db.createCollection("Productos", {
    validator: {
        $jsonSchema: {
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