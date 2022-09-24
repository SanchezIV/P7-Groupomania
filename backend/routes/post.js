//import d'express
const express = require("express");
//Fonction router()
const router = express.Router();

//import du controllers sauce
const post = require("../controllers/post");

//Import du middleware auth pour sécuriser les routes
const auth = require("../middleware/auth");
//Import du middleware multer pour la gestion des images
const multer = require("../middleware/multer-config");

//router."index"('/', auth, sauce.ANALYSE);
//route pour envoyer tous les Posts

//route pour créer un Post
router.post("/", auth, multer, post.createPost);
router.get("/", auth, post.getAllPost);

//route pour Afficher 1 Post
router.get("/:id", auth, post.getOnePost);
//route pour la modification d'un Post
router.put("/:id", auth, multer, post.modifyPost);
//route pour la suppréssion d'une Post
router.delete("/:id", auth, post.deletePost);

//Routes Like/Unlike post
router.patch('/like-post/:id', auth, post.likePost);
router.patch('/unlike-post/:id', auth, post.unlikePost);

//les routes en liens avec les commentaires
router.patch('/comment-post/:id', auth, post.commentPost);
router.patch('/edit-comment-post/:id', auth, post.editCommentPost);
router.patch('/delete-comment-post/:id',auth,  post.deleteCommentPost);

module.exports = router;
