// Controllers contient la logique métier qui est appliquer à chaques routes.

const bcrypt = require('bcrypt');       // On importe la librairie bcrypt pour le hachage des mots de passes.
const jwt = require('jsonwebtoken');    // On importe le package jsonwebtoken pour chiffrer des tokens
const User = require('../models/user'); // On importe le model user 

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * Fonction".hash" = async permettant le cryptage/hash d'un mot de passe.
 * 1er argument => le mot de passe du corp de la requête.
 * 2eme argument => c'est le nombre de fois que l'on exécute l'algorithme de hashage. (saler)
 */
exports.signup = (req, res, next) => {
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

/**
 * 
 * @param {object} req 
 * @param {object} res
 * La méthode '.compare' de bcrypt compare un string avec un hash pour, par exemple, 
 * vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé 
 * enregistré en base de données.Cela montre que même bcrypt ne peut pas décrypter ses propres hashs
 */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // La fonction '.sign()' de jsonwebtoken utilise une clé secrète pour chiffrer un token qui peut contenir un payload personnalisé et avoir une validité limitée.
                           { userId: user._id },    // 1er argument: payload, les données que l'on veux encodées = user._id.
                           'RANDOM_TOKEN_SECRET',   // 2ème argument: La clé secrète pour l'encodage.
                           { expiresIn: '72h'}      // 3ème argument: argument de configuration, on applique une expiration de 72h pour notre token.
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };