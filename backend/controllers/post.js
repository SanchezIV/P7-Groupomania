//Import du model de la sauce
const Post = require("../models/Posts");
const User = require('../models/User');
//Package file system pour modifier le système de donnée pour la foncion delete
const fs = require("fs");
// const Posts = require("../models/Posts");
const commentsPost = Post.comments;

//Création d'un Post
exports.createPost = (req, res) => {
  const protocol = req.protocol;
  const host = req.get("host")
  const messageField = req.body.message;

  //si il y a un message mais pas de fichier
  if (messageField !== "" && !req.file) {
    const post = new Post({
      userId: req.auth.userId,
      pseudo: req.body.pseudo,
      message: req.body.message,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ message: "Post enregistré" });
        console.log(post);
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
  //si il y a un message et un fichier
  else if (messageField !== "" && req.file) {
    const post = new Post({
      userId: req.auth.userId,
      pseudo: req.body.pseudo,
      message: req.body.message,
      image: `${protocol}://${host}/images/${req.file.filename}`,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ message: "Post enregistré" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
};

//Modification d'un Post
exports.modifyPost = (req, res) => {
  const protocol = req.protocol;
  const host = req.get("host")

  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      // On récupère le post grace a son ID
      Post.findOne({ _id: req.params.id })
        .then((thing) => {
          // On vérifie si l'ID de la personne qui a crée le post, correspond a l'ID de la personne authantifier ou si l'utilisateur est admin
          if (thing.userId === req.auth.userId || user.isAdmin === true) {

            // Si il y a un message et une image
            if (req.body.message && req.file) {
              // On Update (modifie) le post avec un nouveau message et une nouvelle image
              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    message: req.body.message,
                    image: `${protocol}://${host}/images/${req.file.filename
                      }`,
                  },
                }
              )
                .then(() => {
                  // Si il y a une nouvelle image
                  if (thing.image) {
                    // On remplace (supprime) l'encienne image
                    const filename = thing.image.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                      console.log("image suppr");
                    });
                  }

                  res.status(200).json({ message: "Post mis à jour!" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
            // Si il n'y a qu'un message
            else if (req.body.message && !req.file) {
              // On Update (modifie) le post avec un nouveau message
              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    message: req.body.message,
                  },
                }
              )
                .then(() => {
                  res.status(200).json({ message: "Message mis à jour!" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
            // Si il n'y a qu'une image
            else if (req.file && !req.body.message) {
              // On Update (modifie) le post avec une nouvelle image
              Post.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    image: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                      }`,
                  },
                }
              )
                .then(() => {
                  // Si il y a une nouvelle image
                  if (thing.image) {
                    // On remplace (supprime) l'encienne image
                    const filename = thing.image.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                      console.log("image suppr");
                    });
                  }
                  res.status(200).json({ message: "Image mise à jour!" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
          } else {
            res.status(401).json({ message: "Not authorized" });
          }
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((err) => res.status(500).json(err));
};
//Supprimer un post
exports.deletePost = (req, res) => {
  User.findOne({ _id: req.auth.userId })

    .then((user) => {
      Post.findOne({ _id: req.params.id })
        .then((post) => {
          if (post.userId === req.auth.userId || user.isAdmin === true) {
            if (!post.image) {
              Post.deleteOne({ _id: req.params.id })
                .then(() => {
                  res.status(200).json({ message: "Objet supprimé !" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
            else {
              Post.deleteOne({ _id: req.params.id })
                .then(() => {
                  const filename = post.image.split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => {
                  });
                  res.status(200).json({ message: "Objet supprimé !" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
          } else {
            res.status(401).json({ message: "Not authorized" });
          }
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((err) => {res.status(500).json(err)})


};
//Récupère un Post unique par l'id
exports.getOnePost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};
//Récupération de tous les Post
exports.getAllPost = (req, res) => {
  Post.find().sort({ _id: -1 })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

//******Liker un Post********/
exports.likePost = async (req, res) => {
  //ajout de l'id de l'user ayant liké au array likers du post
  try {
    //on identifie l'id du post//on transmet l'id de la personne ayant like au array likers
    await Post.findByIdAndUpdate({ _id: req.params.id }, { $addToSet: { likers: req.auth.userId } }, { new: true })
    console.log(req.params.id);
    //ajout de l'id du créateur de post au array likes du liker
    //on trouve l'id du liker//on transmet l'id du post au array likes du liker
    await User.findByIdAndUpdate(req.auth.userId, { $addToSet: { likes: req.params.id } }, { new: true })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  }
  catch (err) {
    console.log("hello");
    return res.status(400).send(err);
  }
};

//**********Unliker un post**********/
exports.unlikePost = async (req, res) => {
  try {
    //on identifie l'id du post//on enlève l'id de la personne ayant like du array likers
    await Post.findByIdAndUpdate({ _id: req.params.id }, { $pull: { likers: req.auth.userId } }, { new: true })
    //suppresion de l'id du post du array likes du liker
    //on trouve l'id du liker//on enlève l'id du post du array likes du liker
    await User.findByIdAndUpdate(req.auth.userId, { $pull: { likes: req.params.id } }, { new: true })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  }
  catch (err) {
    return res.status(400).send(err);
  }
};

//*****Commenter un post****/
exports.commentPost = (req, res) => {
  //on verifie si l'user existe
  try {
    //l'id du post
    //on push dans le array du post le nouveau commentaire
    return Post.findByIdAndUpdate({ _id: req.params.id }, {
      $push: {
        comments: {
          commenterId: req.auth.userId,
          commenterPseudo: req.body.commenterPseudo,
          text: req.body.text,
        }
      },
    },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err)
      }
    );
  }
  catch (err) {
    return res.status(400).send(err);
  }
};

//*******Edit Comment*********/
exports.editCommentPost = (req, res) => {
  try {
    //l'id du du post dans lequel on veut modifier un comment
    return Post.findById({ _id: req.params.id },
      (err, docs) => {
        //on cible l'id du commentaire a verifier
        const theComment = docs.comments.find((comment) =>
          // on verifie que l'id du commentaire est identique dans le body et dans la docs
          comment._id.equals(req.body.commentId)
        )
        //si le commentaire n'existe pas
        if (!theComment) return res.status(404).send("comment not found")
        theComment.text = req.body.text;
        //si le commentaire existe on envoi l'edit (docs)
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err)
        })
      },
    );
  }
  catch (err) {
    return res.status(400).send(err);
  }
};

//*********Supprimer son commentaire********/
exports.deleteCommentPost = (req, res) => {
  try {
    //l'id du du post dans lequel on veut modifier un comment
    return Post.findByIdAndUpdate({ _id: req.params.id },
      {
        //on retire du array des comments celui a supprimer
        $pull: {
          comments: {
            //on pointe l'id du comments a supprimer
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err)
      }
    );
  }
  catch (err) {
    return res.status(400).send(err);
  }
};
