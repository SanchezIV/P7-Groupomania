//Import modules pour sécuriser les données utilisateurs a la création/connection d'un utilisateur
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
//route de controles de variables d'envirronement
const hashSecu = process.env.HASH_SECU;

//Import du models User
const User = require("../models/User");


//Creation d'un compte
exports.signup = (req, res) => {
  //regexp => email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]{2,}[@]{1}[a-zA-Z0-9.-_]{2,}[.]{1}[a-z]{2,5}$"
  );
  if (!emailRegExp.test(req.body.email)) {
    return res.status(401).json({ message: "Email invalide" });
  } 

  let pseudoRegExp = new RegExp("^[a-zA-Z0-9]{5,}$");
  if (!pseudoRegExp.test(req.body.pseudo)) {
    return res.status(401).json({ message: "Pseudo invalide" });
  }

  let passworldRegExp = new RegExp("^[a-zA-Z0-9]{6,}$");
  if (!passworldRegExp.test(req.body.password)) {
    return res.status(403).json({ message: "Password invalide" });
  }
  
  bcrypt

    .hash(req.body.password, parseInt(hashSecu))
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        pseudo: req.body.pseudo,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: " Utilisateur créé !" }))
        .catch((err) => {
          res.status(400).json({message:"Erreur : " + err})
        });
    })
    .catch((err) => res.status(500).json({ err }));
};

//Connection a un compte
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Utilisateur introuvable" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire identifiant/mot de passe incorrecte " });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((err) => {
          res.status(500).json({ err })
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

//*********Fonction get all users*******/
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
    res.status(200).json(users);
}

//*******Fonction getOneUser********/
exports.getOneUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

//**********Fonction Delete User***********/
exports.deleteUser = async (req, res) => {
  
  try {
    //on suppr le profil correspondant à l'ID
    await User.deleteOne({_id: req.params.id}).exec();
    res.status(200).send({message: "succesfully deleted!"})
    }
    catch (err) {
        return res.status(500).json({message: err})
    }
}