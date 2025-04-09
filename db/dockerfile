FROM mongo:latest

# Copiar el script de inicialización
COPY init-mongo.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh

EXPOSE 27017