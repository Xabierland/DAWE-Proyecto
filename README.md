# DAWE-Proyecto

Proyecto de la asignatura Desarrollo de Aplicaciones Web Enriquecidas

## Enlace al proyecto

[dawe.xabierland.com](https://dawe.xabierland.com)

## Miembros del grupo

- Xabier Gabiña
- Eneko Etxaniz
- Luken Bilbao
- Ander Gutierrez

## Iniciar el proyecto

### Modo desarrollo

Para iniciar el proyecto ejecuta

```bash
docker compose --profile dev up --build -d
```

### Modo producción

Para iniciar el proyecto ejecuta

```bash
docker compose --profile prod up --build -d
```

## Acceder al proyecto (LOCAL)

Las URLs para acceder a los diferentes servicios son las siguientes:

- Frontend: [http://localhost:3000](http://localhost:3000)
  - Admin
    - Correo: `admin@example.com`
    - Contraseña: `123456`
  - Usuario
    - Correo: `usuario@example.com`
    - Contraseña: `123456`
- Backend: [http://localhost:5000](http://localhost:5000)
- MongoDB: [http://localhost:27017](http://localhost:27017)
  - Usuario: `admin`
  - Contraseña: `admin`
- Mongo Express: [http://localhost:8081](http://localhost:8081)
  - Usuario: `admin`
  - Contraseña: `pass`

## Tareas

- [X] Estructura - Xabier
  - [X] Dockerización - Xabier
- [X] Secciones nuevas - Eneko
- [X] Autenticacion - Xabier
- [X] Panel de usuario - Ander
  - [X] Contador de visitas - Ander
- [X] Seccion Mi Cuenta - Luken
  - [X] Formulario de edición de datos de usuario - Luken
- [X] Seccion "Añadir un producto" - Ander
  - [X] Formulario de subida de productos - Ander
- [X] Seccion "Editar/Borrar productos" - Luken
  - [X] Formulario de edición y borrado de productos - Luken
- [X] Base de datos MongoDB - Eneko
  - [X] Sesión en Express - Eneko
