// #/routes/ = dossier qui contient la logique de nos routes (sauce.js)

// require pour importer le package express de node.
const express = require('express');

/**
 * La méthodeexpress.Router() permet de créer des routeurs séparés 
 * pour chaque route principale de notre application, ont y enregistre 
 * ensuite les routes individuelles.
 */
const router = express.Router();

// require pour importer le nouveau modèle Mongoose dans l'application.
const sauce = require('../models/sauce');

// route POST pour enregistrer une sauce.
router.post('/', (req, res, next) => {
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
});

router.put('/:id', (req, res, next) => {
    /**
     * Méthode updateOne() pour mettre à jour, modifier une sauce
     * dans la base de donnée.
     * -1er argument: l'objet de comparaison, pour savoir lequel on modifie (_id: req.params.id)
     * -2ème argument: le nouvel objet
     */
    sauce.updateOne(({ _id: req.params.id}, { ...req.body, _id: req.params.id}))
    .then(() => res.status(200).json({ message: ' Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
});

router.delete('/:id', (req, res, next) => {
    sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: ' Sauce suprimée !'}))
    .catch(error => res.status(400).json({ error }));
});

/**
 * route GET pour la récupération individuelle d'une sauce.
 * Les ":" de la route permettent de dire à Express que cette partie de la 
 * route est dynamique. On y à accès dans "req.params.id".
 */
 router.get('/:id', (req, res, next) => {
    /**
     * Méthode findOne() pour trouver un seul objet, on lui passe un objet de
     * comparaison: _id(id de l'objet): req.params.id(id du paramètre de requête)
     */
    sauce.findOne({ _id: req.params.id})
    .then(oneSauce => res.status(200).json(oneSauce))
    .catch(error => res.status(400).json({error}));
});

// route GET pour récupérer toutes les sauces.
router.get('/', (req, res, next) => {
    //Méthode find() pour renvoyer un tableau contenan toute les sauces de la base de donnée.
    sauce.find()
    .then(sauces => res.status(201).json(sauces))
    .catch(error => res.status(400).json({error}));
});

/**
 * A l'aide de la méthode 'module.exports' ont viens exporter notre routeur
 * pour pouvoir l'uytilisé dans d'autres programme ( avec l'instruction 'import')
 */
module.exports = router;