# Etapa 1: build de la app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: servir con nginx
FROM nginx:alpine

# Copia el build al directorio por defecto de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia archivo de configuración opcional si lo tienes
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
