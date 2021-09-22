const Sauce = require('../models/sauces');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(
    (allSauces) => {
      //console.log(allSauces);
      res.status(200).json(allSauces);
    }
  )
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(
    (oneSauce) => {
      res.status(200).json(oneSauce);
    }
  )
  .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`,
    //imageUrl: `${req.protocol}://127.0.0.1:8081/pictures/${req.file.filename}`,
    likes: `0`,
    dislikes: `0`,
    usersLiked: ``,
    usersDisliked: ``
  });
  //console.log(newSauce);
  newSauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistréé !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
      //imageUrl: `${req.protocol}://127.0.0.1:8081/backend/pictures/${req.file.filename}`,
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/pictures/')[1];
      fs.unlink(`pictures/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
