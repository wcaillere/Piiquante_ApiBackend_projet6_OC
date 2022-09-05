const express = require('express');
const mongoose = require('mongoose');

//Connexion to the DB mongoDB
mongoose.connect('mongodb+srv://william:testapi@testopenclassrooms.9fdhbms.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express()

module.exports = app;