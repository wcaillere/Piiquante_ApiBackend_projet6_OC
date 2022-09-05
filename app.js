const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

console.log(process.env.DB_USER);

//Connexion to the DB mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@testopenclassrooms.9fdhbms.mongodb.net/?retryWrites=true&w=majority`)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express()

module.exports = app;