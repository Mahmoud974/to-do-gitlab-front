# Utiliser l'image officielle Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application Next.js
CMD ["npm", "start"]
