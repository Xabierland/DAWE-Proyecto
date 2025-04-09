// Importaciones
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const usuariosRouter = require('./rutas/usuarios');
const productosRouter = require('./rutas/productos');

// Configuración
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:admin@db:27017/tienda?authSource=admin';

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Configuración de sesiones
app.use(session({
  secret: 'clave_secreta_para_firmar_session',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    ttl: 60 * 60 * 24 // 24 horas de duración de la sesión
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// Middleware para incrementar el contador de visitas
app.use((req, res, next) => {
  if (req.session.email) {
    if (!req.session.visitas) {
      req.session.visitas = 1;
    } else {
      req.session.visitas += 1;
    }
  }
  next();
});

// Rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de la tienda funcionando correctamente' });
});

// Iniciar servidor
async function iniciarServidor() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Conexión exitosa con MongoDB');
    
    // Pasar la conexión de MongoDB a las rutas
    app.locals.db = client.db('tienda');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

iniciarServidor();