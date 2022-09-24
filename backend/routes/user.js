//Import express
const express = require("express");

//Import controllers/user.js
const userCtrl = require("../controllers/user");
//Import du middleware auth pour sécuriser les routes
const auth = require("../middleware/auth");

//Fonction router()
const router = express.Router();

//Route signup user
router.post("/signup", userCtrl.signup);
//Route login user
router.post("/login", userCtrl.login);
//route pour getOneUser
router.get("/:id", auth, userCtrl.getOneUser);
//Route GetALLUsers
router.get("/", userCtrl.getAllUsers);
//Route DeleteUser
router.delete('/:id', auth, userCtrl.deleteUser);

//Exportation du module
module.exports = router;
