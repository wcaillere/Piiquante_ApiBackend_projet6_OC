//import packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

//import Routers
const userRoutes = require('./routes/user')
const saucesRoutes = require('./routes/sauces')

//Connexion to the DB mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}/?retryWrites=true&w=majority`)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => {
  console.log('Connexion à MongoDB échouée !');
  console.log(error);
});

//create and configure express app
const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;