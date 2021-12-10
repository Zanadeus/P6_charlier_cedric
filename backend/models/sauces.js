const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, //identifiant utilisateur
  name: { type: String, minLength: 5, required: true }, //nom de la sauce
  manufacturer : { type: String, minLength: 3, required: true }, //fabricant de la sauce
  description: { type: String, minLength: 10, required: true }, //description de la sauce
  mainPepper: { type: String, required: true }, //principal ingrédient épicé
  imageUrl: { type: String, required: true }, //URL de l'image de sauce
  heat: {type: Number, required: true}, //valeur sur 10 du piquant de la sauce
  likes: { type: Number, default: '0', required: false }, //nombre de "likes"
  dislikes: { type: Number, default: '0', required: false }, //nombre de "dislikes"
  usersLiked: { type: String, default: '', required: false }, //tableau des gens qui ont liké la sauce
  usersDisliked: { type: String, default: '', required: false } // tableau des gens qui ont disliké la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);