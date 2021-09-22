//Fonctionnement du code
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/users');

exports.signup = (req, res, next) => 
{
  /*
  if (user.findOne({ email: req.body.email }) !== 'undefined') 
  {
    return res.status(403).json({ message: 'email déjà utilisé' })
  }
  */
  bcrypt.hash(req.body.password, 10)
    .then(hash => 
      {
        let myUser = new user(
        {
          email: req.body.email,
          password: hash
        });
        myUser.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }))
          //.then(console.error());
      })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  user.findOne({ email: req.body.email })
    .then(myUser => {
      if (!myUser) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, myUser.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          //res.setHeader('Authorization', 'Bearer '+ newToken);
          res.status(200).json(
          {
            userId: myUser._id,
            token: jwt.sign(
              { userId: myUser._id },
              'Bearer',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};