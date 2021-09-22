//Constantes de fonctionnement
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creation d'un modèle utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Vérification du caractère unique de l'identifiant
userSchema.plugin(uniqueValidator);

//Envoi du modèle utilisateur
module.exports = mongoose.model('user', userSchema);
