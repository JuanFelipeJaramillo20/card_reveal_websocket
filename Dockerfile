# Establecer la imagen base a Node.js
FROM node:14

# Establecer el directorio de trabajo en la imagen de Docker
WORKDIR /usr/src/app

# Copiar el archivo de package.json y package-lock.json 
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código de la aplicación a la imagen de Docker
COPY . .

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "run", "dev" ]