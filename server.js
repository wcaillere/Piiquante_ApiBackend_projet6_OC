//import packages
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

//return a port. Val can be a string or a Number
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Connexion to the DB mongoDB. If the connexion is failed, the app is not listen.
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}/?retryWrites=true&w=majority`)
.then(() => {
  console.log('Connexion à MongoDB réussie !');
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})
.catch(error => {
  console.log('Connexion à MongoDB échouée !');
  console.log(error);
});

