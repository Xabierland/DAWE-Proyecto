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

## Tareas

- [] Estructura - Xabier
  - [X] Dockerización
- [] Secciones nuevas
- [] Autenticacion - Xabier
- [] Panel de usuario
  - [] Contador de visitas
- [] Seccion Mi Cuenta
  - [] Formulario de edición de datos de usuario
- [] Seccion "Añadir un producto"
  - [] Formulario de subida de productos
- [] Seccion "Editar/Borrar productos"
  - [] Formulario de edición y borrado de productos
- [] Base de datos MongoDB - Eneko
  - [] Sesión en Express
