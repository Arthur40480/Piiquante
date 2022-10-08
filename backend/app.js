// #app.js = fichier qui contient l'application

// require = C'est la commande pour importer le package express de node.
const express = require('express');

// require = C'est la commande pour importer le package mongoose.
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Arthur21051993:Papamaman21051993@cluster0.srnkobz.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/** déclaration de la constante app qui sera notre application
On apelle la méthode express() pour créer une application express
*/
const app = express();

/**
 * Middleware :
 * Il intercepte toutes les données qui contiennent du JSON
 * (content-type json) et nous mette à disposition ce contenu
 * sur l'objet requête dans req.body = "body parser"
 */
app.use(express.json());

/**
 * Middleware :
 * Pas de route en premier argument car c'est un middleware général,
 * Ces headers permettent :
 * - d'accéder depuis n'importe qu'elle origine ( '*' )
 * - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) 
 * - d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST, .. )
 */
app.use((req, res, next) => {
    // On rajoute des headers sur l'objet réponse:
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// fonction "next", elle permet de renvoyer à la prochaine fonction l'exécution du serveur
app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});
app.use((req, res, next) => {
    res.status(201);
    next();
});
app.use((req, res, next) => {
    res.json({ message: 'Votre requête à bien été reçue !'});
    next();
});
app.use((req, res) => {
    console.log("Réponse envoyée avec succès !");
});

/**
 * l'instruction export est utilisée dans les modules Javascript pour exporter 
 * les fonctions, objets ou valeurs primitives d'un module pour pouvoir être 
 * utilisés dans d'autres programmes ( à l'aide de l'instruction 'import')
 */
module.exports = app;
