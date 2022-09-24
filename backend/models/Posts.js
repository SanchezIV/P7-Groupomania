//Import Mongoose
const mongoose = require("mongoose");

//Model des sauces
const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  pseudo: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String},
  likers: { type: [String]},
  comments: {
    type: [
      {
        commenterId: String,
        commenterPseudo: String,
        text: String,
      },
    ],
  },
});

const postModel = mongoose.model("Posts", postSchema);
module.exports = postModel;
