//Fonctionnement du serveur
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config();

//limiter le nombre de requêtes (attaques DDOS)
const rateLimit = require("express-rate-limit");
const antiDDOS = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(antiDDOS);
const antiForcageId = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3
});

//Connection à la BDD
mongoose.connect(process.env.DB_LOGIN,
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
  //gestion du preflight, à recontrôler avant mise en production
  if (req.method === "OPTIONS") 
  {
    return res.status(200).end();
  }
  return next();
});

//equivalent body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoads = require('./roads/users');
const saucesRoads = require('./roads/sauces');

app.use('/pictures', express.static(path.join(__dirname, 'pictures')));
app.use('/api/auth', antiForcageId, userRoads);
app.use('/api/sauces', saucesRoads);

module.exports = app;