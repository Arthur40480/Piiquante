// #controllers contient la logique métier qui est appliquer à chaques routes.

// require viens importer les models sauce.js
const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const saucesData = JSON.parse(req.body.sauce);
    /**
     * Ici on viens créer une instance de notre modèle 'sauce' en lui passant un objet 
     * Javscript contenant toutes les informations requises du corps de requête analysé.
     * On supprime en amont le faux 'userId' envoyer par le frontend.
     */
    delete saucesData._id;
    delete saucesData._userId;
    const sauce = new Sauce ({
        // L'opérateur spread '...' permet de faire des copies de tous les éléments de req.body
        ...saucesData,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    /**
     * Méthode .save() qui permet d'enregistrer l'objet dans la base de données.
     * Elle renvoi une Promise donc => .then() .catch() ...
     */
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !"}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    /**
     * Méthode updateOne() pour mettre à jour, modifier une sauce
     * dans la base de donnée.
     * -1er argument: l'objet de comparaison, pour savoir lequel on modifie (_id: req.params.id)
     * -2ème argument: le nouvel objet
     */
    Sauce.updateOne(({ _id: req.params.id}, { ...req.body, _id: req.params.id}))
    .then(() => res.status(200).json({ message: ' Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: ' Sauce suprimée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.readOneSauce = (req, res, next) => {
    /**
     * Méthode findOne() pour trouver un seul objet, on lui passe un objet de
     * comparaison: _id(id de l'objet): req.params.id(id du paramètre de requête)
     */
    Sauce.findOne({ _id: req.params.id})
    .then(oneSauce => res.status(200).json(oneSauce))
    .catch(error => res.status(400).json({error}));
};

exports.listAllSauce = (req, res, next) => {
    //Méthode find() pour renvoyer un tableau contenan toute les sauces de la base de donnée.
    Sauce.find()
    .then(sauces => res.status(201).json(sauces))
    .catch(error => res.status(400).json({error}));
};

// Like & Dislike d'une sauce
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