// app = fichier qui contient l'application

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit"); // Limiteur de connexion 

//définition des caractéristiques du limiteur de connexion
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
	max: 10, // Limite chaque IP à 5 connexions max par fenêtre de 15 minutes
	standardHeaders: true, // Retourne la limitation dans le header `RateLimit-*`
	legacyHeaders: false, // désactive les headers `X-RateLimit-*`
});
const app = express();

require('dotenv').config();



// require pour importer le routeur ( des sauces, et des users)
const saucesRoutes = require('./routes/sauce');
const usersRoutes = require('./routes/user');

// Utilisation de la méthode 'mongoose.connect' pour se connecter à MongoDB.
mongoose.connect(process.env.MONGOOSE_PASSWORD,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

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

/**
 * Middleware :
 * Il intercepte toutes les données qui contiennent du JSON
 * (content-type json) et nous mette à disposition ce contenu
 * sur l'objet requête dans req.body = "body parser"
 */
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Pour cette route la '/api/sauces' on utilise le routeur saucesRoutes
app.use('/api/sauces', saucesRoutes);

// Pour cette route la '/api/auth' on utilise le routeur usersRoutes
app.use('/api/auth', usersRoutes, limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));

/**
 * l'instruction export est utilisée dans les modules Javascript pour exporter 
 * les fonctions, objets ou valeurs primitives d'un module pour pouvoir être 
 * utilisés dans d'autres programmes ( à l'aide de l'instruction 'import')
 */
module.exports = app;
