const express = require('express'); // On importe le package express de node.
const usersCtrl = require('../controllers/user');   // On importe les fonctions de notre controllers. 
const password = require('../middleware/password'); // On importe le middleware password.
const email = require('../middleware/email');   // On importe le middleware email.

/**
 * La méthodeexpress.Router() permet de créer des routeurs séparés 
 * pour chaque route principale de notre application, ont y enregistre 
 * ensuite les routes individuelles.
 */
const router = express.Router();

router.post('/signup', password, email, usersCtrl.signup); // Route POST pour créer un compte.
router.post('/login', usersCtrl.login); // Route POST pour se connecter.

/**
 * A l'aide de la méthode 'module.exports' ont viens exporter notre routeur
 * pour pouvoir l'uytilisé dans d'autres programme ( avec l'instruction 'import')
 */
module.exports = router;