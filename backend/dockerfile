FROM node:23-slim

WORKDIR /app

# Copiar solo el package.json y package-lock.json para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de archivos
COPY . .

# Exponer el puerto en el que corre Express
EXPOSE 8000

# Comando para iniciar el servidor en modo producción
CMD ["npm", "start"]