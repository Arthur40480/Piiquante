// require = C'est la commande pour importer le package mongoose.
const mongoose = require('mongoose');

/**
 * On rajoute ce validateur comme plugin à notre shéma
 */
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Utilisation de la fonction .Schema du package mongoose pour
 * créer un shéma de données qui seront les données utilisateurs
 * pour pouvoir ce connecter.
 */
const schemaUsers = mongoose.Schema({
    /**
     * On passe la configuration 'required' pour dire que ce champ est requis.
     * On passe la configuration 'unique' pour pas que l'adresse mail soit utilisée
     * plusieurs fois pour plusieurs compte différents.
     */
    email: { type: String, required: true, unique: true }, // adresse e-mail de l'utilisateur [unique]
    password: { type: String, required: true }, // mot de passe de l'utilisateur haché
});

// On applique ce validator à notre schéma avant d'en faire un model
schemaUsers.plugin(uniqueValidator);

/**
 * Pour exploiter ce schéma comme model pour cela, on vas utiliser
 * la méthode du package mongoose 'models':
 * - 1er argument c'est le nom du model,
 * - 2ème argument c'est le schéma à utiliser
 */
 module.exports = mongoose.model( 'Users' , schemaUsers);
