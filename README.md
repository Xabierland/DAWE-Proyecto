# DAWE-Proyecto

Proyecto de la asignatura Desarrollo de Aplicaciones Web Enriquecidas

## Enlace al proyecto

[dawe.xabierland.com](https://dawe.xabierland.com)

[dawe2.xabierland.com](https://dawe2-xabierland.com)

## Miembros del grupo

- Xabier Gabiña
- Eneko Etxaniz
- Luken Bilbao
- Ander Gutierrez

## Iniciar el proyecto

### Instalar dependencias

```bash
npm install
```

### Entorno de Desarrollo

#### Iniciar el servidor

```bash
npm start
```

### Entorno de Produccion

#### Build

```bash
npm run build
```

#### Iniciar el servidor

```bash
serve -s build
```

## Division de Tareas

### React

- [X] Cabecera - Xabier
- [X] MenuNavegacion - Ander
- [X] BuscadorProductos - Luken
- [X] EscaparateProductos - Xabier
  - [X] Paginacion
  - [X] DetallesProducto
- [X] FormularioNuevosProductos - Ander
  - [X] Drag&Drop
- [X] Pie - Xabier
- [X] Carrito - Eneko
  
### Carrito almacenado en localStorage 

- [X] GuardarEnCarrito - Eneko
- [X] Borra un producto por su ID del localStorage - Eneko
- [X] CargarCarrito - Eneko
 
### Offline

- [X] Formulario gris - Luken
- [X] Aviso rojo - Luken
- [X] Service Worker - Xabier

### Otros

- [X] Constantes : DIVISA y MAX_COPIAS - Xabier
