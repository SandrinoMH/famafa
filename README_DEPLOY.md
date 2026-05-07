# 🚀 Déploiement de Famafa

Ce projet est composé d'un frontend Angular et d'un backend Node.js utilisant `rembg` (Python).

## 🌍 Stratégie de déploiement recommandée

Le moteur de suppression de fond (`rembg`) est lourd et nécessite un environnement Python complet. **Vercel (Serverless)** n'est pas idéal pour la partie backend à cause des limites de taille des fonctions.

### 1. Frontend (Vercel)
Le frontend Angular est prêt pour Vercel.
- **Build Command** : `npm run build`
- **Output Directory** : `dist/remove-bg-app/browser`
- **Framework Preset** : `Angular`

### 2. Backend (Render / Railway / VPS)
Hébergez le dossier `backend` sur un service supportant Python et Node.js.
- **Commande de lancement** : `node server.js`
- **Dépendances système** : Python 3.12 + `pip install "rembg[cpu,cli]"`

---

## 🛠️ Instructions pour GitHub

1. **Initialiser Git** :
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit - ready for deployment"
   ```

2. **Créer un repo sur GitHub** et liez-le :
   ```bash
   git remote add origin https://github.com/VOTRE_USER/famafa.git
   git branch -M main
   git push -u origin main
   ```

3. **Configuration Vercel** :
   - Connectez votre repo GitHub sur [Vercel](https://vercel.com).
   - Dans `vercel.json`, remplacez l'URL du backend par l'URL réelle de votre serveur déployé.

---

## 📁 Fichiers de configuration inclus
- `.gitignore` : Nettoyé pour exclure les fichiers inutiles et temporaires.
- `vercel.json` : Configuré pour le routing Angular et le proxy API.
- `package.json` : Script de build standard.
