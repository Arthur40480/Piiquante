// #/routes/ = dossier qui contient la logique de nos routes (user.js)

// require pour importer le package express de node.
const express = require('express');

/**
 * La méthodeexpress.Router() permet de créer des routeurs séparés 
 * pour chaque route principale de notre application, ont y enregistre 
 * ensuite les routes individuelles.
 */
const router = express.Router();

// require pour importer les fonctions de notre controllers.    
const usersCtrl = require('../controllers/user');

// require pour importer le middleware password.
const password = require('../middleware/password');

// require pour importer le middleware email.
const email = require('../middleware/email');

router.post('/signup', password, email, usersCtrl.signup); // Route POST pour créer un compte.
router.post('/login', usersCtrl.login); // Route POST pour se connecter.

/**
 * A l'aide de la méthode 'module.exports' ont viens exporter notre routeur
 * pour pouvoir l'uytilisé dans d'autres programme ( avec l'instruction 'import')
 */
 module.exports = router;