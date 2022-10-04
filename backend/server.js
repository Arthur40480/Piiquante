// Runtime Node, c'est ce qui permet d'éxecuter du code javascript
// require = C'est la commande pour importer le package http de node.
const http = require('http');

/**
 * La méthode http.createServer() transforme votre ordinateur en serveur HTTP.
La méthode http.createServer() crée un objet HTTP Server.
L'objet HTTP Server peut écouter les ports de votre ordinateur et exécuter une fonction, un requestListener, chaque fois qu'une requête est faite.
Cette méthode prend en argument, la fonction qui sera appellée à chaques requêtes reçu par le serveur ->
cette fonction prend automatiquement deux argument la requête et la réponse (req, res) qui sont des objets.
 */
const server = http.createServer((req, res) => {
    // Méthode .end pour renvoyer une réponse de type "string" à l'appelant
    res.end(' Voilà la réponse du serveur ! ')
});

/**La méthode server.listen() crée une écoute sur le port ou le chemin spécifié.
En paramètre, le num du port que l'on veut écouter -> par défaut 3000
Si le port 300 n'est pas dispo -> utilisation d'une variable environement = process.env.PORT
*/
server.listen(process.env.PORT || 3000);