const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creation d'un modèle utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, minLength: 8, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
