// #controllers contient la logique métier qui est appliquer à chaques routes.

// require viens importer les models sauce.js
const sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const saucesData = JSON.parse(req.body.sauce);
    /**
     * Ici on viens créer une instance de notre modèle 'sauce' en lui passant un objet 
     * Javscript contenant toutes les informations requises du corps de requête analysé.
     * On supprime en amont le faux 'userId' envoyer par le frontend.
     */
    delete saucesData.userId;
    const sauces = new sauce ({
        // L'opérateur spread '...' permet de faire des copies de tous les éléments de req.body
        ...saucesData,
    });
    /**
     * Méthode .save() qui permet d'enregistrer l'objet dans la base de données.
     * Elle renvoi une Promise donc => .then() .catch() ...
     */
    sauces.save()
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
    sauce.updateOne(({ _id: req.params.id}, { ...req.body, _id: req.params.id}))
    .then(() => res.status(200).json({ message: ' Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: ' Sauce suprimée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    /**
     * Méthode findOne() pour trouver un seul objet, on lui passe un objet de
     * comparaison: _id(id de l'objet): req.params.id(id du paramètre de requête)
     */
    sauce.findOne({ _id: req.params.id})
    .then(oneSauce => res.status(200).json(oneSauce))
    .catch(error => res.status(400).json({error}));
};

exports.getAllSauce = (req, res, next) => {
    //Méthode find() pour renvoyer un tableau contenan toute les sauces de la base de donnée.
    sauce.find()
    .then(sauces => res.status(201).json(sauces))
    .catch(error => res.status(400).json({error}));
};