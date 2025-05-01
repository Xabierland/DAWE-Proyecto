# Dockerfile multi-etapa para frontend

# Etapa base común para ambos entornos
FROM node:23-slim as base
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Etapa de desarrollo
FROM base as development
# Exponer el puerto para desarrollo
EXPOSE 3000
# Montar el código fuente como volumen en docker-compose
# Comando para iniciar el servidor de desarrollo
CMD ["npm", "start"]

# Etapa de construcción para producción
FROM base as build
# Copiar todo el código fuente
COPY . .
# Construir la aplicación para producción
RUN npm run build

# Etapa final para producción
FROM node:23-slim as production
WORKDIR /app

# Instalar serve para servir la aplicación compilada
RUN npm install -g serve

# Copiar los archivos de la etapa de construcción
COPY --from=build /app/build ./build

# Exponer el puerto para producción
EXPOSE 3000

# Comando para servir la aplicación compilada
CMD ["serve", "-s", "build", "-l", "3000"]