FROM node:22-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Compilar la aplicación React con Vite
RUN npm run build

# --- Etapa de Producción (Servidor Web) ---
FROM nginx:alpine

# Copiar los archivos compilados estáticos (de la carpeta dist de Vite) al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 para tráfico web
EXPOSE 80

# Arrancar Nginx
CMD ["nginx", "-g", "daemon off;"]
