// routes = dossier qui contient la logique de nos routes (sauce.js)

const express = require('express');                     // On importe le framework Express.js
const saucesCtrl = require('../controllers/sauce');     // On importe la logique métier de nos sauces.
const multer = require('../middleware/multer-config');  // On importe le middleware où se trouve le package multer.
const auth = require('../middleware/auth');             // On importe le middleware auth.

/**
 * La méthodeexpress.Router() permet de créer des routeurs séparés 
 * pour chaque route principale de notre application, ont y enregistre 
 * ensuite les routes individuelles.
 */
const router = express.Router();

router.post('/', auth, multer, saucesCtrl.createSauce); // Route POST pour enregistrer une sauce.
// Les ":" de la route permettent de dire à Express que cette partie de la route est dynamique. On y à accès dans "req.params.id". 
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // Route PUT pour modifier une sauce.
router.delete('/:id', auth, saucesCtrl.deleteSauce); // Route DELETE pour supprimer une sauce.
router.get('/:id', auth, saucesCtrl.readOneSauce); // Route GET pour la récupérer une sauce. 
router.get('/', auth, saucesCtrl.listAllSauce); // Route GET pour récupérer toutes les sauces.
router.post("/:id/like", auth, saucesCtrl.sauceLikes); // Route poste pour enregistrer l'ajout ou le retrait d'un like sur une sauce.

/**
 * A l'aide de la méthode 'module.exports' ont viens exporter notre routeur
 * pour pouvoir l'utilisé dans d'autre programme ( avec l'instruction 'import')
 */
module.exports = router;