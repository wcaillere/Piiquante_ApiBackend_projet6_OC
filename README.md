# Backend API Piiquante #

(le frontend de l'application est disponible sur ce lien https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6)

### Installation du backend ###

Depuis le dossier "backend", lancer `npm install` pour créer le dossier node_modules. Le serveur pourra ensuite être démarré en lançant `nodemon server`.

### BD MongoDB ###

Pour des raisons de sécurité, le véritable fichier .env n'est pas disponible ici. Pour faire fonctionner la base de données, renommez le fichier `.env.exemple` en `.env`, et remplissez les variables avec les données de votre propre base de données MongoDB pour que le "mongoose.connect" du fichier app.js puisse fonctionner et se connecter à la base de donnée choisie. Choisissez également une Token_key sécurisée pour votre projet. 

### Lancement du serveur ###

Si le lancement du server avec `nodemon server` se passe bien, les messages "Listening on port 3000" et "Connexion à MongoDB réussie !" s'afficheront dans la console. 