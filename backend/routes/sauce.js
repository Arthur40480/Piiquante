// #/routes/ = dossier qui contient la logique de nos routes (sauce.js)

// require pour importer le package express de node.
const express = require('express');

/**
 * La méthodeexpress.Router() permet de créer des routeurs séparés 
 * pour chaque route principale de notre application, ont y enregistre 
 * ensuite les routes individuelles.
 */
const router = express.Router();

// require pour importer les fonctions de notre controllers.    
const saucesCtrl = require('../controllers/sauce');

router.post('/', saucesCtrl.createSauce); // Route POST pour enregistrer une sauce.
// Les ":" de la route permettent de dire à Express que cette partie de la route est dynamique. On y à accès dans "req.params.id". 
router.put('/:id', saucesCtrl.modifySauce); // Route PUT pour modifier une sauce.
router.delete('/:id', saucesCtrl.deleteSauce); // Route DELETE pour supprimer une sauce.
router.get('/:id', saucesCtrl.getOneSauce); // Route GET pour la récupérer une sauce. 
router.get('/', saucesCtrl.getAllSauce); // Route GET pour récupérer toutes les sauces.

/**
 * A l'aide de la méthode 'module.exports' ont viens exporter notre routeur
 * pour pouvoir l'uytilisé dans d'autres programme ( avec l'instruction 'import')
 */
module.exports = router;