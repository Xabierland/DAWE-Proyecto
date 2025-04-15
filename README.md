# DAWE-Proyecto

Proyecto de la asignatura Desarrollo de Aplicaciones Web Enriquecidas

## Enlace al proyecto

[dawe.xabierland.com](https://dawe.xabierland.com)

[dawe3.xabierland.com](https://dawe3.xabierland.com)

## Miembros del grupo

- Xabier Gabiña
- Eneko Etxaniz
- Luken Bilbao
- Ander Gutierrez

## Iniciar el proyecto

Para iniciar el proyecto ejecuta

```bash
docker compose up --build -d
```

Si nada funciona prueba a purgar docker

```bash
docker system prune -a --volumes -f
```

## Acceder al proyecto

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
  - [X] Dockerización
- [X] Secciones nuevas
- [X] Autenticacion - Xabier
- [X] Panel de usuario
  - [X] Contador de visitas
- [X] Seccion Mi Cuenta
  - [X] Formulario de edición de datos de usuario
- [X] Seccion "Añadir un producto"
  - [X] Formulario de subida de productos
- [X] Seccion "Editar/Borrar productos"
  - [X] Formulario de edición y borrado de productos
- [X] Base de datos MongoDB - Eneko
  - [X] Sesión en Express
