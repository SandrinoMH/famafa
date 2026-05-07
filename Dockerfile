# Utiliser une image avec Node et Python
FROM nikolaik/python-nodejs:python3.12-nodejs20-slim

# Installer les dépendances système pour rembg et onnxruntime
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier le package.json de la racine (car les dépendances backend y sont)
COPY package.json ./
RUN npm install --production

# Copier tout le dossier backend
COPY backend/ ./backend/

# Créer le dossier uploads
RUN mkdir -p backend/uploads

# Installer les dépendances Python
RUN pip install --no-cache-dir "rembg[cpu,cli]" Pillow

# Pré-télécharger le modèle pour éviter les timeouts au premier lancement
RUN python3 -c "from rembg import new_session; new_session('u2net')"

EXPOSE 3000

# Lancer le serveur
CMD ["node", "backend/server.js"]
