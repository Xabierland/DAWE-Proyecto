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
  // Orígenes permitidos (frontend en desarrollo y en Docker)
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://frontend:3000'],
  // Permitir enviar cookies en peticiones cross-origin
  credentials: true,
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Cabeceras permitidas
  allowedHeaders: ['Content-Type', 'Authorization']
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
    ttl: 60 * 60 * 24,
    // Guardar inmediatamente las sesiones
    autoRemove: 'native'
  }),
  // Configuración de la cookie de sesión
  cookie: {
    // En desarrollo, secure debe ser false
    secure: false, // En producción: process.env.NODE_ENV === 'production'
    // No permitir acceso desde JavaScript del cliente
    httpOnly: true,
    // Importante para cookies entre sitios
    sameSite: 'lax',
    // Duración máxima: 24 horas
    maxAge: 1000 * 60 * 60 * 24,
    // Dominio (comentado por ahora)
    // domain: 'localhost'
  }
}));

// Registro de rutas accedidas (para depuración)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// === RUTAS ===
// Ruta específica para incrementar contador de visitas
// Esto evita múltiples incrementos por recarga
app.post('/api/usuarios/incrementar-visitas', (req, res) => {
  if (req.session.email) {
    if (!req.session.visitas) {
      req.session.visitas = 1;
    } else {
      req.session.visitas += 1;
    }
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar sesión:', err);
        return res.status(500).json({ error: 'Error al incrementar visitas' });
      }
      res.json({ visitas: req.session.visitas });
    });
  } else {
    res.status(401).json({ error: 'No hay sesión activa' });
  }
});

// Montar las rutas de usuarios en /api/usuarios
app.use('/api/usuarios', usuariosRouter);

// Montar las rutas de productos en /api/productos
app.use('/api/productos', productosRouter);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API de la tienda funcionando correctamente',
    // Devolver información de la sesión actual para debug
    session: req.session.email ? {
      email: req.session.email,
      visitas: req.session.visitas,
      // No devolver información sensible
    } : 'No hay sesión activa'
  });
});

// Ruta para verificar el estado de la sesión
app.get('/api/check-session', (req, res) => {
  if (req.session.email) {
    res.json({ 
      autenticado: true, 
      email: req.session.email,
      visitas: req.session.visitas 
    });
  } else {
    res.json({ autenticado: false });
  }
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