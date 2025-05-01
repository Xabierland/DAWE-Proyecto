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

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const productos = await db.collection('Productos').find({}).toArray();
    
    // Mapear los productos para ajustar el formato de respuesta
    const productosMapeados = productos.map(producto => {
      // Base de producto común para todos los tipos
      const productoMapeado = {
        id: producto._id,
        tipo: producto.Tipo,
        nombre: producto.Nombre,
        precio: producto.Precio,
        descripcion: producto.Descripcion,
        imagen: producto.RutaImagen || '/imagenes/productos/default.png'
      };
      
      // Añadir campos específicos según el tipo de producto
      switch (producto.Tipo) {
        case 'libro_Fisico':
          productoMapeado.autor = producto.Autor;
          productoMapeado.isbn = producto.Isbn;
          productoMapeado.paginas = producto.Paginas;
          break;
        case 'libro_Digital':
          productoMapeado.autor = producto.Autor;
          productoMapeado.isbn = producto.Isbn;
          productoMapeado.paginas = producto.Paginas;
          productoMapeado.tamano = producto.Tamano;
          break;
        case 'ereader':
          productoMapeado.resolucion = producto.Resolucion;
          break;
        case 'funda':
          productoMapeado.material = producto.Material;
          break;
        case 'marcapaginas':
          productoMapeado.color = producto.Color;
          break;
      }
      
      return productoMapeado;
    });
    
    res.json(productosMapeados);
  } catch (error) {
    //console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener lista de productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const producto = await db.collection('Productos').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Mapear el producto para ajustar el formato de respuesta (mismo formato que en GET /)
    const productoMapeado = {
      id: producto._id,
      tipo: producto.Tipo,
      nombre: producto.Nombre,
      precio: producto.Precio,
      descripcion: producto.Descripcion,
      imagen: producto.RutaImagen || '/imagenes/productos/default.png'
    };
    
    // Añadir campos específicos según el tipo de producto
    switch (producto.Tipo) {
      case 'libro_Fisico':
        productoMapeado.autor = producto.Autor;
        productoMapeado.isbn = producto.Isbn;
        productoMapeado.paginas = producto.Paginas;
        break;
      case 'libro_Digital':
        productoMapeado.autor = producto.Autor;
        productoMapeado.isbn = producto.Isbn;
        productoMapeado.paginas = producto.Paginas;
        productoMapeado.tamano = producto.Tamano;
        break;
      case 'ereader':
        productoMapeado.resolucion = producto.Resolucion;
        break;
      case 'funda':
        productoMapeado.material = producto.Material;
        break;
      case 'marcapaginas':
        productoMapeado.color = producto.Color;
        break;
    }
    
    res.json(productoMapeado);
  } catch (error) {
    //console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener información del producto' });
  }
});

// Crear un nuevo producto (solo para administradores)
router.post('/', verificarAdmin, async (req, res) => {
  const { tipo, nombre, precio, descripcion, imagen, autor, isbn, paginas, tamano, resolucion, material, color } = req.body;
  
  // Validar campos obligatorios
  if (!tipo || !nombre || !precio) {
    return res.status(400).json({ error: 'Tipo, nombre y precio son campos obligatorios' });
  }
  
  try {
    const db = req.app.locals.db;
    
    // Crear objeto base para el nuevo producto
    // Aseguramos que los tipos de datos coincidan exactamente con el esquema de MongoDB
    
    // Validar y convertir el precio a double
    const precioDouble = parseFloat(precio);
    if (isNaN(precioDouble)) {
      return res.status(400).json({ error: 'El precio debe ser un valor numérico válido' });
    }
    
    // MongoDB requiere que Precio sea explícitamente double, por lo que nos aseguramos
    // que tenga decimales, incluso si ingresaron un número entero
    // Al hacer la operación + 0.0 MongoDB lo tratará como double en lugar de int
    
    const nuevoProducto = {
      Tipo: String(tipo),
      Nombre: String(nombre),
      Precio: precioDouble + 0.0, // Forzar tipo double añadiendo 0.0
      Descripcion: descripcion ? String(descripcion) : '',
      RutaImagen: imagen ? String(imagen) : '/imagenes/productos/default.png'
    };
    
    // Añadir campos específicos según el tipo de producto
    switch (tipo) {
      case 'libro_Fisico':
        if (!autor || !isbn || !paginas) {
          return res.status(400).json({ error: 'Para un libro físico, autor, ISBN y número de páginas son obligatorios' });
        }
        nuevoProducto.Autor = String(autor);
        nuevoProducto.Isbn = String(isbn);
        // Asegurarse de que Paginas sea un entero (int)
        const paginasInt = parseInt(paginas);
        if (isNaN(paginasInt)) {
          return res.status(400).json({ error: 'El número de páginas debe ser un valor numérico válido' });
        }
        nuevoProducto.Paginas = paginasInt;
        break;
      case 'libro_Digital':
        if (!autor || !isbn || !paginas || !tamano) {
          return res.status(400).json({ error: 'Para un libro digital, autor, ISBN, número de páginas y tamaño son obligatorios' });
        }
        nuevoProducto.Autor = String(autor);
        nuevoProducto.Isbn = String(isbn);
        // Asegurarse de que Paginas y Tamano sean enteros (int)
        const paginasDigitalInt = parseInt(paginas);
        const tamanoInt = parseInt(tamano);
        if (isNaN(paginasDigitalInt) || isNaN(tamanoInt)) {
          return res.status(400).json({ error: 'El número de páginas y tamaño deben ser valores numéricos válidos' });
        }
        nuevoProducto.Paginas = paginasDigitalInt;
        nuevoProducto.Tamano = tamanoInt;
        break;
      case 'ereader':
        if (!resolucion) {
          return res.status(400).json({ error: 'Para un ereader, la resolución es obligatoria' });
        }
        // Asegurarse de que Resolucion sea un entero (int)
        const resolucionInt = parseInt(resolucion);
        if (isNaN(resolucionInt)) {
          return res.status(400).json({ error: 'La resolución debe ser un valor numérico válido' });
        }
        nuevoProducto.Resolucion = resolucionInt;
        break;
      case 'funda':
        if (!material) {
          return res.status(400).json({ error: 'Para una funda, el material es obligatorio' });
        }
        nuevoProducto.Material = String(material);
        break;
      case 'marcapaginas':
        if (!color) {
          return res.status(400).json({ error: 'Para un marcapáginas, el color es obligatorio' });
        }
        nuevoProducto.Color = String(color);
        break;
      default:
        return res.status(400).json({ error: 'Tipo de producto no válido' });
    }
    
    //console.log('Intentando insertar producto:', nuevoProducto);
    
    const resultado = await db.collection('Productos').insertOne(nuevoProducto);
    
    res.status(201).json({ 
      mensaje: 'Producto creado correctamente',
      id: resultado.insertedId
    });
  } catch (error) {
    //console.error('Error al crear producto:', error);
    
    // Proporcionar información más detallada sobre el error
    let mensajeError = 'Error al crear producto';
    if (error.errInfo && error.errInfo.details) {
      mensajeError += ': ' + JSON.stringify(error.errInfo.details);
    }
    
    res.status(500).json({ error: mensajeError });
  }
});

// Actualizar un producto (solo para administradores)
router.put('/:id', verificarAdmin, async (req, res) => {
  const { tipo, nombre, precio, descripcion, imagen, autor, isbn, paginas, tamano, resolucion, material, color } = req.body;
  
  // Validar campos obligatorios
  if (!tipo || !nombre || !precio) {
    return res.status(400).json({ error: 'Tipo, nombre y precio son campos obligatorios' });
  }
  
  try {
    const db = req.app.locals.db;
    
    // Verificar que el producto existe
    const productoExistente = await db.collection('Productos').findOne({ _id: new ObjectId(req.params.id) });
    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Crear objeto con los campos actualizados
    const productoActualizado = {
      Tipo: tipo, // El tipo no debería cambiar, pero lo incluimos por consistencia
      Nombre: nombre,
      Precio: parseFloat(precio),
      Descripcion: descripcion || '',
    };
    
    // Actualizar imagen solo si se proporciona una nueva
    if (imagen) {
      productoActualizado.RutaImagen = imagen;
    }
    
    // Añadir campos específicos según el tipo de producto
    switch (tipo) {
      case 'libro_Fisico':
        if (autor) productoActualizado.Autor = autor;
        if (isbn) productoActualizado.Isbn = isbn;
        if (paginas) productoActualizado.Paginas = parseInt(paginas);
        break;
      case 'libro_Digital':
        if (autor) productoActualizado.Autor = autor;
        if (isbn) productoActualizado.Isbn = isbn;
        if (paginas) productoActualizado.Paginas = parseInt(paginas);
        if (tamano) productoActualizado.Tamano = parseInt(tamano);
        break;
      case 'ereader':
        if (resolucion) productoActualizado.Resolucion = parseInt(resolucion);
        break;
      case 'funda':
        if (material) productoActualizado.Material = material;
        break;
      case 'marcapaginas':
        if (color) productoActualizado.Color = color;
        break;
    }
    
    const resultado = await db.collection('Productos').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: productoActualizado }
    );
    
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ 
      mensaje: 'Producto actualizado correctamente' 
    });
  } catch (error) {
    //console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar un producto por ID (solo para administradores)
router.delete('/:id', verificarAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const resultado = await db.collection('Productos').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    //console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Eliminar múltiples productos (solo para administradores)
router.delete('/', verificarAdmin, async (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Debe proporcionar un array de IDs' });
  }
  
  try {
    const db = req.app.locals.db;
    
    // Convertir strings a ObjectId
    const objectIds = ids.map(id => new ObjectId(id));
    
    const resultado = await db.collection('Productos').deleteMany({ _id: { $in: objectIds } });
    
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para eliminar' });
    }
    
    res.json({ 
      mensaje: 'Productos eliminados correctamente',
      eliminados: resultado.deletedCount
    });
  } catch (error) {
    //console.error('Error al eliminar productos:', error);
    res.status(500).json({ error: 'Error al eliminar productos' });
  }
});

module.exports = router;