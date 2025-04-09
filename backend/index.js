// === IMPORTACIONES ===
// Framework Express para crear el servidor web
const express = require('express');

// Middleware CORS para permitir peticiones desde dominios diferentes (frontend)
const cors = require('cors');

// Cliente de MongoDB para conectar con la base de datos
const { MongoClient } = require('mongodb');

// Middleware de sesiones para Express
const session = require('express-session');

// Almacenamiento de sesiones en MongoDB
const MongoStore = require('connect-mongo');

// Importar las rutas definidas en ficheros separados
const usuariosRouter = require('./rutas/usuarios');
const productosRouter = require('./rutas/productos');

// === CONFIGURACIÓN ===
// Crear la aplicación Express
const app = express();

// Puerto donde se ejecutará el servidor (8000 por defecto)
const PORT = process.env.PORT || 8000;

// URL de conexión a MongoDB (usa variables de entorno o valores predeterminados)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin@db:27017/tienda?authSource=admin';

// === MIDDLEWARE ===
// Parsear JSON en el cuerpo de las peticiones (aumentamos el límite para imágenes en base64)
app.use(express.json({ limit: '50mb' }));

// Parsear formularios URL-encoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar CORS para permitir peticiones desde el frontend
// Es crucial para que funcionen las cookies de sesión entre dominios
app.use(cors({
  // Orígenes permitidos (localhost:3000 es el frontend en desarrollo)
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  // Permitir enviar cookies en peticiones cross-origin
  credentials: true
}));

// === CONFIGURACIÓN DE SESIONES ===
app.use(session({
  // Clave secreta para firmar la cookie de sesión (debería estar en variable de entorno)
  secret: 'clave_secreta_para_firmar_session',
  // No guardar la sesión si no se ha modificado
  resave: false,
  // No crear sesión hasta que algo se almacene
  saveUninitialized: false,
  // Guardar sesiones en MongoDB en lugar de memoria
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    // Tiempo de vida de la sesión: 24 horas
    ttl: 60 * 60 * 24
  }),
  // Configuración de la cookie de sesión
  cookie: {
    // Modo seguro solo en producción (requiere HTTPS)
    secure: process.env.NODE_ENV === 'production',
    // No permitir acceso desde JavaScript del cliente
    httpOnly: true,
    // Duración máxima: 24 horas
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// === MIDDLEWARE PERSONALIZADO ===
// Incrementar contador de visitas en cada petición
app.use((req, res, next) => {
  // Solo si hay una sesión iniciada (usuario autenticado)
  if (req.session.email) {
    // Si no existe el contador, inicializarlo a 1
    if (!req.session.visitas) {
      req.session.visitas = 1;
    } else {
      // Incrementar en 1 si ya existe
      req.session.visitas += 1;
    }
  }
  // Continuar con la siguiente función middleware
  next();
});

// === RUTAS ===
// Montar las rutas de usuarios en /api/usuarios
app.use('/api/usuarios', usuariosRouter);

// Montar las rutas de productos en /api/productos
app.use('/api/productos', productosRouter);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de la tienda funcionando correctamente' });
});

// === INICIAR SERVIDOR ===
async function iniciarServidor() {
  try {
    // Crear cliente de MongoDB
    const client = new MongoClient(MONGO_URI);
    
    // Conectar a MongoDB
    await client.connect();
    console.log('✅ Conexión exitosa con MongoDB');
    
    // Pasar la instancia de la base de datos a las rutas
    app.locals.db = client.db('tienda');
    
    // Iniciar el servidor en el puerto configurado
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    // Salir con código de error
    process.exit(1);
  }
}

// Ejecutar la función para iniciar el servidor
iniciarServidor();