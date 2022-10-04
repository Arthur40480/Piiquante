// #app.js = fichier qui contient l'application

// require = C'est la commande pour importer le package express de node.
const express = require('express');

/** déclaration de la constante app qui sera notre application
On apelle la méthode express() pour créer une application express
*/
const app = express();

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
    console.log("Réponse envoyée avec succès !")
})

/**
 * l'instruction export est utilisée dans les modules Javascript pour exporter 
 * les fonctions, objets ou valeurs primitives d'un module pour pouvoir être 
 * utilisés dans d'autres programmes ( à l'aide de l'instruction 'import')
 */
module.exports = app;
