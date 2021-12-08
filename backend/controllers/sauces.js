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
/*
  const jwt = require('jsonwebtoken');
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'Bearer');
  if (decodedToken.userId === sauceObject.userId)
  {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  }
  else
  {
    return res.status(401).json({ message : 'Invalid user ID' }));
  }
*/
};

exports.deleteSauce = (req, res, next) => 
{
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => 
    {
      const filename = sauce.imageUrl.split('/pictures/')[1];
      fs.unlink(`pictures/${filename}`, () => 
      {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce deleted !'}))
          .catch(error => res.status(400).json({ error }));
      });

      /*
      if (res.token.userId === sauce.userId)
      {
        const filename = sauce.imageUrl.split('/pictures/')[1];
        fs.unlink(`pictures/${filename}`, () => 
        {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      
      }
      else
      {
        return res.status(401).json({ message : 'Invalid user ID' }));;
      }
      */
    })
    .catch(error => res.status(500).json({ error }));
};

exports.setLike = (req, res, next) => 
{
  Sauce.findOne({ _id: req.params.id })
    .then(sauce =>
      {
        /*_______________________DEFINITION DES VARIABLES_______________________*/
        let userID = req.body.userId;
        let sauceLikes = sauce.likes;
        let sauceDislikes = sauce.dislikes; 
        //let usersThatLike
        if (sauce.usersLiked == '') 
        {
          usersThatLike = [];
        } 
        else 
        {
          usersThatLike = sauce.usersLiked.split(',');
        };
        //let usersThatDislike
        if (sauce.usersDisliked == '') 
        {
          usersThatDislike = [];
        } 
        else 
        {
          usersThatDislike = sauce.usersDisliked.split(',');
        };
        
        //variables nécessaires pour isUserRate()
        let userFound = false;
        let deleteUserPosition = '';

        let userEverLikeIt = false;
        let userEverDislikeIt = false;
        let likePositionToDelete = '';
        let dislikePositionToDelete = '';

        /*_______________________DEFINITION DES FONCTIONS_______________________*/
        //On recherche si l'utilisateur a déja noté la sauce
        function isUserRateIt() 
        {
          for (let i = 0; i < usersThatLike.length; i++) 
          {
            const element = usersThatLike[i];
            if (element === userID) 
            {
              userEverLikeIt = true;
              console.log('userThatLike = '+userEverLikeIt);
              likePositionToDelete = i;
            }
          }
          for (let i = 0; i < usersThatDislike.length; i++) 
          {
            const element = usersThatDislike[i];
            if (element === userID) 
            {
              userEverDislikeIt = true;
              console.log('userThatDislike = '+userEverDislikeIt);
              dislikePositionToDelete = i;
            }
          }
        }
        //On met à jour les likes dans la base données
        function updateLikes()
        {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $set:
              { 
                likes: sauceLikes,
                dislikes: sauceDislikes,
                usersLiked: usersThatLike.join(','),
                usersDisliked: usersThatDislike.join(',')
              }
            })
            .then(() => res.status(200).json({ message: 'Mise à jour effectuée'}))
            .catch(error => res.status(400).json({ error }));
        };
        /*
        //fonction de développement, on remet à zéro la base de données des likes
        function resetLikes()
        {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $set:
              { 
                likes: `0`,
                dislikes: `0`,
                usersLiked: ``,
                usersDisliked: ``
              }
            })
            .then(() => res.status(200).json({ message: 'Mise à jour effectuée'}))
            .catch(error => res.status(400).json({ error }));
        };
        */
        
        /*_______________________COEUR DU LOGICIEL_______________________*/
        isUserRateIt();
        switch (req.body.like)
        {
          case 1:
            if (userEverLikeIt == true) 
            {
              //res.status(202).json({ message : 'Produit déjà liké ! Recliquer pour annuler le vote'});
              usersThatLike.splice(likePositionToDelete, 1);
              sauceLikes-- ;
              updateLikes();
            } 
            else 
            {
              usersThatLike.push(userID);
              sauceLikes++ ;
              updateLikes();
            }
            break;
          case -1:
            if (userEverDislikeIt == true) 
            {
              //res.status(202).json({ message : 'Produit déjà disliké ! Recliquer pour annuler le vote'});
              usersThatDislike.splice(dislikePositionToDelete, 1);
              sauceDislikes-- ;
              updateLikes();
            } 
            else 
            {
              usersThatDislike.push(userID);
              sauceDislikes++ ;
              updateLikes();
            }
            break;
          default:
            console.log("la requête 0 a été sélectionnée.");
            
            if (userEverLikeIt == true) 
            {
              usersThatLike.splice(likePositionToDelete, 1);
              sauceLikes-- ;
              updateLikes();
            } 
            if (userEverDislikeIt == true) 
            {
              usersThatDislike.splice(dislikePositionToDelete, 1);
              sauceDislikes-- ;
              updateLikes();
            } 
            
            //resetLikes();
            break;
        }
      })
};
