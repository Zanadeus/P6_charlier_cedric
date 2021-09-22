const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, //identifiant utilisateur
  name: { type: String, required: true }, //nom de la sauce
  manufacturer : { type: String, required: true }, //fabricant de la sauce
  description: { type: String, required: true }, //description de la sauce
  mainPepper: { type: String, required: true }, //princpal ingrédient épicé
  imageUrl: { type: String, required: true }, //URL de l'image de sauce
  heat: {type: Number, required: true}, //valeur /10 du piquant de la sauce
  likes: { type: Number, required: false }, //nombre de "likes"
  dislikes: { type: Number, required: false }, //nombre de "dislikes"
  usersLiked: { type: String, required: false }, //tableau des gens qui ont liké la sauce
  usersDisliked: { type: String, required: false } // tableau des gens qui ont disliké la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);