# Usa una imagen base de Node.js 20 Alpine
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de package.json y pnpm-lock.yaml
COPY package.json ./

# Instala las dependencias de producción
RUN npm install -g pnpm && pnpm install --prod

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que la aplicación usará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "pnpm", "start" ] 