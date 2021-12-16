const Sauce = require('../models/sauces');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(
    (allSauces) => {
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
  });
  
  newSauce.save()
  .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistréé !'}))
  .catch(error => res.status(400).json({ message: error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
    //imageUrl: `${req.protocol}://127.0.0.1:8081/backend/pictures/${req.file.filename}`,
  } : { ...req.body };
  if (res.locals.userId !== sauceObject.userId) 
  {
    return res.status(403).json({ message : 'Invalid user ID' });
  }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => 
{
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => 
    {
      if (res.locals.userId !== sauce.userId) 
      {
        return res.status(403).json({ message : 'Invalid user ID' });
      }
      const filename = sauce.imageUrl.split('/pictures/')[1];
      fs.unlink(`pictures/${filename}`, () => 
      {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce deleted !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.setLike = (req, res, next) => 
{
  const userID = req.body.userId;
  const sauceId = req.params.id;
  
  switch (req.body.like)
  {
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $push:{usersLiked: userID},
          $inc:{likes: +1}
        })
        .then(() => res.status(200).json({ message: 'Sauce likée !'}))
        .catch(error => res.status(400).json({ error }));
    break;

    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $push:{usersDisliked: userID},
          $inc:{dislikes: +1}
        })
        .then(() => res.status(200).json({ message: 'Sauce dislikée !'}))
        .catch(error => res.status(400).json({ error }));
    break;

    case 0:
      Sauce.findOne({_id: sauceId})
      .then(sauce => 
      {
        if (sauce.usersLiked.includes(userID)) 
        {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull:{usersLiked: userID},
              $inc:{likes: -1}
            })
            .then(() => res.status(200).json({ message: 'Like retiré !'}))
            .catch(error => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(userID)) 
        {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull:{usersDisliked: userID},
              $inc:{dislikes: -1}
            })
            .then(() => res.status(200).json({ message: 'Dislike retiré'}))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
      break;

      default:
        console.log('case non configuré');
      break

  }
};
