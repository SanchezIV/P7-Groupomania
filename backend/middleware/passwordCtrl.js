//Importation de password-validator
const passwordValidator = require("password-validator");

//Création du schéma
const passwordSchema = new passwordValidator();

//Le schéma que doit respecter le mot de passe
passwordSchema
  .is()
  .min(5) // Longueur minimale 5
  .is()
  .max(20) // Longueur maximal 20
  .has()
  .uppercase() // Doit avoir des lettres majuscules
  .has()
  .lowercase() // Doit contenir des lettres minuscules
  .has()
  .digits(2) // Doit avoir au moins 2 chiffres
  .has()
  .not()
  .spaces() // Ne doit pas avoir d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Azerty1", "Azerty123"]); // Mettre ces valeurs sur liste noire

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate(
        "req.body.password",
        { list: true }
      )}`,
    });
  }
};
