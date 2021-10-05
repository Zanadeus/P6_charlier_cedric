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

        /*_______________________DEFINITION DES FONCTIONS_______________________*/
        //On recherche si l'utilisateur a déja noté la sauce
        function isUserRate(rateArray) 
        {
          for (let i = 0; i < rateArray.length; i++) 
          {
            const element = rateArray[i];
            if (element == userID) 
            {
              userFound = true;
              console.log(userFound);
              deleteUserPosition = i;
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
        //fonction nulle en cas d'incohérence avec le frontend
        function nothingHappen() 
        {
          console.log("erreur de traitement de l'action demandée")
          .then(() => res.status(400).json({ message: 'Echec mise à jour'}))
          .catch(error => res.status(400).json({ error }));
        }
        //fonction de développement, on restaure la base de données des likes
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

        /*_______________________COEUR DU LOGICIEL_______________________*/
        switch (req.body.like)
        {
          case 1:
            isUserRate(usersThatLike);
            //On enregistre l'action de l'utilisateur
            if (userFound == true) 
            {
              //nothingHappen();
              usersThatLike.splice(deleteUserPosition, 1);
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
            isUserRate(usersThatDislike);
            //On enregistre l'action de l'utilisateur
            if (userFound == true) 
            {
              //nothingHappen();
              usersThatDislike.splice(deleteUserPosition, 1);
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
            isUserRate(usersThatLike);
            //On enregistre l'action de l'utilisateur
            if (userFound == true) 
            {
              usersThatLike.splice(deleteUserPosition, 1);
              sauceLikes-- ;
              updateLikes();
            } 

            isUserRate(usersThatDislike);
            //On enregistre l'action de l'utilisateur
            if (userFound == true) 
            {
              usersThatDislike.splice(deleteUserPosition, 1);
              sauceDislikes-- ;
              updateLikes();
            } 
            
            //resetLikes();
            break;
        }
      })
};
