// Controllers contient la logique métier qui est appliquer à chaques routes.

const Sauce = require('../models/sauce');   // On importe le model sauce
const User = require('../models/user');     // On importe le model user
const fs = require('fs');                   // On importe le module fs ( File system)

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * Méthode .save() qui permet d'enregistrer l'objet dans la base de données.
 * Ici on viens créer une instance de notre modèle 'sauce' en lui passant un objet 
 * javscript contenant toutes les informations requises du corps de requête analysé.
 */
exports.createSauce = (req, res, next) => {
    const saucesData = JSON.parse(req.body.sauce);
    delete saucesData._id;
    delete saucesData._userId;          // On supprime en amont le faux 'userId' envoyer par le frontend.
    const sauce = new Sauce ({
        ...saucesData,                  // L'opérateur spread '...' permet de faire des copies de tous les éléments de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()               
    .then(() => res.status(201).json({ message: "Sauce enregistrée !"}))
    .catch(error => res.status(400).json({error}));
};

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * Méthode updateOne() pour mettre à jour, modifier une sauce dans la base de donnée.
 * -1er argument: l'objet de comparaison, pour savoir lequel on modifie (_id: req.params.id)
 * -2ème argument: le nouvel objet
 */
exports.modifySauce = (req, res, next) => {
    console.log(req);
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non autorisé'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
  };

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next  
 * Méthode deleteOne() pour supprimer une sauce dans la base de données.
 * La méthode fs.unlink() est utilisée pour supprimer un fichier ou un 
 * lien symbolique du système de fichiers.
 */
 exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non autorisé'});
            } else {
                const imageName = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${imageName}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
  };

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * Méthode findOne() pour trouver un seul objet dans la base de données, on lui passe un objet de
 * comparaison: _id(id de l'objet): req.params.id(id du paramètre de requête)
 */
exports.readOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(oneSauce => res.status(200).json(oneSauce))
    .catch(error => res.status(400).json({error}));
};

/**
 * 
 * @param {object} res 
 * Méthode find() pour renvoyer un tableau contenant toute les sauces de la base de données.
 */
exports.listAllSauce = (req, res, next) => {
    Sauce.find()               
    .then(sauces => res.status(201).json(sauces))
    .catch(error => res.status(400).json({error}));
};

// PARTIE LIKE & DISLIKES D'UNE SAUCE

/**
 * 
 * @param {object} req 
 * @param {object} res  
 */
exports.sauceLikes = (req, res, next) => {
    let sauceId = req.params.id
    let userId = req.body.userId // La propriété req.body contient des paires clé-valeur de données soumises dans le corps de la requête.
    let like = req.body.like
    
    switch(like) { // L'instruction switch évalue une expression et, selon le résultat obtenu et le cas associé, exécute les instructions correspondantes.
    // Si like = 1, l'utilisateur aime (= likes)
        case 1 : 
        Sauce.updateOne(
            { _id: sauceId }, 
            {
                $push : { usersLiked: userId }, // L’opérateur $push permet de rajouter un nouvel élément à un tableau.
                $inc : { likes: +1 } // $inc permet de rajouter une valeur à une donnée numérique. 
            }
        )  
            .then(() => res.status(200).json({message: "J'aime"}))
            .catch((error) => res.status(400).json({ error }));

    break;

    // Si like = 0, l'utilisateur annule son like ou son dislike
        case 0 :
        Sauce.findOne(
            { _id: sauceId }
        )
        .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne(
                    { _id: sauceId },
                    {
                        $pull: { usersLiked: userId },
                        $inc: { likes: -1 }
                    }
                )
                    .then(() => res.status(200).json({message: "Unliked"}))
                    .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne(
                    { _id: sauceId },
                    {
                        $pull: { usersDisliked: userId },
                        $inc: { dislikes: -1 }
                    }
                )
                .then(() => res.status(200).json({message: "Undisliked"}))
                .catch((error) => res.status(400).json({ error }))
            }
        })
        .catch((error) => res.status(404).json({ error }))
    
    break;
  
// Si like = -1, l'utilisateur n'aime pas (= dislikes)
    case -1 :
        Sauce.updateOne(
            { _id: sauceId }, 
            {
                $push : { usersDisliked: userId },
                $inc : { dislikes: +1 }
            }
        )  
        .then(() => res.status(200).json({message: "Je n'aime pas"}))
        .catch((error) => res.status(400).json({ error }));
    
    break;
    }
};