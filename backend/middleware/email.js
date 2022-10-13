// require pour importer le package email validator de node.
const emailValidator = require('email-validator');

emailValidator.validate("test@email.com"); 

module.exports = (req, res, next) => {
    if(emailValidator.validate("test@email.com")) {
        next()
    }else{
        return res.status(400).json({error : "Merci de renseigner une adresse e-mail valide."})
    }
}