const mongoose = require('mongoose');   // On importe le package mongoose.

/**
 * Utilisation de la fonction .Schema du package mongoose pour
 * créer un shéma de données qui seront les données utilisateurs
 * pour la page du frontend.
 */
const schemaSauces = mongoose.Schema({
    /**
     * - La clé qui sera le nom du champ : "userId",
     * - On créer un objet pour configurer l'userId,
     * - On vas donner le type de l'userId = String,
     * - On passe la configuration 'required' pour dire que ce champ est requis.
     */
    userId: { type: String, required: true },            // l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true },             // nom de la sauce
    manufacturer: { type: String, required: true},     // fabricant de la sauce
    description: { type: String, required: true},     // description de la sauce
    mainPepper: { type: String, required: true},     // le principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: true },     // l'URL de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true },        // nombre entre 1 et 10 décrivant la sauce

    /**
     * Likes/Dislikes + Utilisateurs qui ont aimer ou non la sauce
     * On passe la configuration 'defaut': 0 pour commencer les likes/dislikes à 0.
     */
    likes: { type: Number, defaut: 0 },     // nombre d'utilisateurs qui aiment (= likent) la sauce
    dislikes: { type: Number, defaut: 0 },  //  nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
    usersLiked: { type: [String] },         // tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
    usersDisliked: { type: [String] },      // tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
});

/**
 * Pour exploiter ce schéma comme model pour cela, on vas utiliser
 * la méthode du package mongoose 'models':
 * - 1er argument c'est le nom du model,
 * - 2ème argument c'est le schéma à utiliser
 */
module.exports = mongoose.model( 'Sauce' , schemaSauces);