// #controllers contient la logique métier qui est appliquer à chaques routes.

// require pour importer le package bcrypt de node.
const bcrypt = require('bcrypt');

// require pour importer le package json web token de node.
const jwt = require('jsonwebtoken');

// require viens importer les models user.js
const User = require('../models/user');

exports.signup = (req, res, next) => {
    /**
     * Fonction".hash" = async permettant le cryptage/hash d'un mot de passe.
     * 1er argument => le mot de passe du corp de la requête
     * 2eme argument => c'est le nombre de fois que l'on exécute l'algorithme de hashage. (saler)
     */
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json ({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            /**
             * La méthode '.compare' de bcrypt compare un string avec un hash pour, par exemple, 
             * vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé 
             * enregistré en base de données.Cela montre que même bcrypt ne peut pas décrypter ses propres hashs
             */
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // La fonction '.sign()' de jsonwebtoken utilise une clé secrète pour chiffrer un token qui peut contenir un payload personnalisé et avoir une validité limitée.
                           { userId: user._id }, // 1er argument: payload, les données que l'on veux encodées = user._id.
                           'RANDOM_TOKEN_SECRET', // 2ème argument: La clé secrète pour l'encodage.
                           { expiresIn: '72h'} // 3ème argument: argument de configuration, on applique une expiration de 24h pour notre token.
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };