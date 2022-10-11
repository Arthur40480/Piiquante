// #Middleware middleware qui va vérifier que l’utilisateur est bien connecté et transmettre les informations de connexion aux différentes méthodes qui vont gérer les requêtes.

// require pour importer le package json web token de node.
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        /**
         * On récupère le header, on le .split() donc on divise la chaîne de caractère
         * en un tableau autour de l'espace ( ' ' ).
         */
        const token = req.headers.authorization.split(' ')[1];
        /**
         * On viens décoder le token à l'aide de la méthode '.verify'
         * On lui passe le token récupérer, ainsi que la clé secrète
         */
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        // On récupère l'userId en particuliers
        const userId = decodedToken.userId;
        
        /**
         * Nous rajoutons cette valeur à l'objet req qui vas 
         * être transmis au routes qui vont être appelées par la suite
         */
        req.auth = {
            userId: userId
        }
    
        // Cas d'erreur pour décoder le token.
    } catch(error) {
        res.status(401).json({ error });
    }
};