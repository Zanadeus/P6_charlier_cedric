//Fonctionnement du serveur
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//Connection à la base de données MongoDB | ID: CCHAR - mdp:CCHARadmin
mongoose.connect('mongodb+srv://CCHAR:CCHARadmin@p6-piiquante-cchar.nit78.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Pouvoir effectuer les requètes trans-serveur (host:3000 et host:4200)
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //gestion du preflight
  if (req.method === "OPTIONS") 
  {
    return res.status(200).end();
  }
  return next();
});

app.use(bodyParser.json());

const userRoads = require('./roads/users');
const saucesRoads = require('./roads/sauces');

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));
app.use('/api/auth', userRoads);
app.use('/api/sauces', saucesRoads);

module.exports = app;