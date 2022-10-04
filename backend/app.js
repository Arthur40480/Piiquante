// #app.js = fichier qui contient l'application

// require = C'est la commande pour importer le package express de node.
const express = require('express')

/** déclaration de la constante app qui sera notre application
On apelle la méthode express() pour créer une application express
*/
const app = express();

/**
 * l'instruction export est utilisée dans les modules Javascript pour exporter 
 * les fonctions, objets ou valeurs primitives d'un module pour pouvoir être 
 * utilisés dans d'autres programmes ( à l'aide de l'instruction 'import')
 */
module.exports = app;
