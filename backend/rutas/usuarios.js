const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Middleware para verificar si el usuario está autenticado
const verificarAutenticacion = (req, res, next) => {
  if (!req.session.email) {
    return res.status(401).json({ error: 'Debes iniciar sesión para acceder a este recurso' });
  }
  next();
};

// Middleware para verificar si el usuario es administrador
const verificarAdmin = async (req, res, next) => {
  if (!req.session.email) {
    return res.status(401).json({ error: 'Debes iniciar sesión para acceder a este recurso' });
  }
  
  const db = req.app.locals.db;
  const usuario = await db.collection('Usuarios').findOne({ Email: req.session.email });
  
  if (!usuario || usuario.Rol !== 'administrador') {
    return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
  }
  
  next();
};

// Iniciar sesión (verificación con Firebase se hace en el frontend)
router.post('/login', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'El email es requerido' });
  }
  
  try {
    const db = req.app.locals.db;
    const usuario = await db.collection('Usuarios').findOne({ Email: email });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Guardar datos en la sesión
    req.session.email = usuario.Email;
    req.session.nombre = usuario.Nombre;
    req.session.rol = usuario.Rol;
    req.session.visitas = 0; // Inicializar contador de visitas a 1 (primera visita)
    req.session.ultimaVisitaRegistrada = Date.now(); // Timestamp de última visita
    
    // Guardar la sesión explícitamente para asegurar que se persiste
    req.session.save((err) => {
      if (err) {
        //console.error('Error al guardar la sesión:', err);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
      }
      
      // Imprimir información de depuración
      //console.log('Sesión iniciada para:', usuario.Email);
      //console.log('ID de sesión:', req.sessionID);
      
      // Enviar respuesta al cliente
      res.json({
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario._id,
          nombre: usuario.Nombre,
          email: usuario.Email,
          rol: usuario.Rol,
          animalFavorito: usuario.AnimalFavorito || '',
          libroFavorito: usuario.LibroFavorito || '',
          generoFavorito: usuario.GeneroFavorito || '',
        },
        visitas: req.session.visitas
      });
    });
  } catch (error) {
    //console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
  // Guardar el email para loguear quién cerró sesión
  const email = req.session.email;
  
  req.session.destroy((error) => {
    if (error) {
      //console.error('Error al cerrar sesión:', error);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    
    // Registrar el cierre de sesión
    //console.log('Sesión cerrada para:', email);
    
    // Configurar la cookie de sesión para que expire
    res.clearCookie('connect.sid');
    
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  });
});

// Obtener información del usuario autenticado
router.get('/perfil', verificarAutenticacion, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usuario = await db.collection('Usuarios').findOne({ Email: req.session.email });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Imprimir información de depuración
    //console.log(`Perfil solicitado para: ${usuario.Email} - Visitas: ${req.session.visitas || 1}`);
    
    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.Nombre,
        email: usuario.Email,
        rol: usuario.Rol,
        animalFavorito: usuario.AnimalFavorito || '',
        libroFavorito: usuario.LibroFavorito || '',
        generoFavorito: usuario.GeneroFavorito || '',
      },
      visitas: req.session.visitas || 1
    });
  } catch (error) {
    //console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener información del perfil' });
  }
});

// Incrementar contador de visitas (manualmente controlado desde el frontend)
router.post('/incrementar-visitas', verificarAutenticacion, (req, res) => {
  // Si la sesión no tiene contador, iniciarlo en 1
  if (!req.session.visitas) {
    req.session.visitas = 1;
  } else {
    // Incrementar contador
    req.session.visitas += 1;
  }
  
  // Guardar timestamp de la última vez que se incrementó
  req.session.ultimaVisitaRegistrada = Date.now();
  
  // Guardar sesión explícitamente
  req.session.save((err) => {
    if (err) {
      //console.error('Error al guardar sesión:', err);
      return res.status(500).json({ error: 'Error al incrementar visitas' });
    }
    
    //console.log(`Visita incrementada para ${req.session.email} - Nuevo valor: ${req.session.visitas}`);
    res.json({ visitas: req.session.visitas });
  });
});

// Actualizar información del usuario
router.put('/actualizar', verificarAutenticacion, async (req, res) => {
  const { nombre, animalFavorito, libroFavorito, generoFavorito } = req.body;
  
  // Validar que el nombre no esté vacío
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre no puede estar vacío' });
  }
  
  try {
    const db = req.app.locals.db;
    
    const resultado = await db.collection('Usuarios').updateOne(
      { Email: req.session.email },
      { 
        $set: { 
          Nombre: nombre,
          AnimalFavorito: animalFavorito || '',
          LibroFavorito: libroFavorito || '',
          GeneroFavorito: generoFavorito || ''
        } 
      }
    );
    
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar también el nombre en la sesión
    req.session.nombre = nombre;
    
    // Guardar la sesión explícitamente
    req.session.save((err) => {
      if (err) {
        //console.error('Error al guardar la sesión después de actualizar perfil:', err);
      }
      
      res.json({ 
        mensaje: 'Perfil actualizado correctamente',
        usuario: {
          nombre,
          email: req.session.email,
          rol: req.session.rol,
          animalFavorito: animalFavorito || '',
          libroFavorito: libroFavorito || '',
          generoFavorito: generoFavorito || '',
        } 
      });
    });
  } catch (error) {
    //console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar información del perfil' });
  }
});

// Crear un nuevo usuario (solo para administradores)
router.post('/crear', verificarAdmin, async (req, res) => {
  const { nombre, email, rol, animalFavorito, libroFavorito, generoFavorito } = req.body;
  
  // Validar campos obligatorios
  if (!nombre || !email || !rol) {
    return res.status(400).json({ error: 'Nombre, email y rol son campos obligatorios' });
  }
  
  try {
    const db = req.app.locals.db;
    
    // Verificar que no exista otro usuario con el mismo email
    const usuarioExistente = await db.collection('Usuarios').findOne({ Email: email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    }
    
    const nuevoUsuario = {
      Nombre: nombre,
      Email: email,
      Rol: rol,
      AnimalFavorito: animalFavorito || '',
      LibroFavorito: libroFavorito || '',
      GeneroFavorito: generoFavorito || ''
    };
    
    const resultado = await db.collection('Usuarios').insertOne(nuevoUsuario);
    
    res.status(201).json({ 
      mensaje: 'Usuario creado correctamente',
      id: resultado.insertedId
    });
  } catch (error) {
    //console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Obtener listado de usuarios (solo para administradores)
router.get('/', verificarAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usuarios = await db.collection('Usuarios').find({}).toArray();
    
    // Mapear los resultados para ajustar el formato de respuesta
    const usuariosMapeados = usuarios.map(usuario => ({
      id: usuario._id,
      nombre: usuario.Nombre,
      email: usuario.Email,
      rol: usuario.Rol,
      animalFavorito: usuario.AnimalFavorito || '',
      libroFavorito: usuario.LibroFavorito || '',
      generoFavorito: usuario.GeneroFavorito || '',
    }));
    
    res.json(usuariosMapeados);
  } catch (error) {
    //console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener lista de usuarios' });
  }
});

module.exports = router;