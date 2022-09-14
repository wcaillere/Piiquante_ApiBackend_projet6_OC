# Backend API Piiquante #

(le frontend de l'application est disponible sur ce lien https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6)

### Installation du backend ###

Depuis le dossier "backend", lancer `npm install`. Le serveur pourra ensuite être démarré en lançant `nodemon server`.

### BD MongoDB ###

Pour des raisons de sécurité, les variables d'environnement "DB_USER", "DB_PASSWORD" et "DB_NAME" se sont pas renseignées dans le fichier .env. il suffit de les remplir avec les données de votre propre base de données MongoDB pour que le "mongoose.connect" du fichier app.js puisse fonctionner et se connecter à la base de donnée choisie. 