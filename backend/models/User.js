//Import Mongoose
const mongoose = require("mongoose");
//Import mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

//Model users
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pseudo: {type: String, required: true},
  bio: { type: String, max: 500},
  followers: {type: [String]},
  following: {type: [String]},
  likes: {type: [String]},
  isAdmin: {type: Boolean, default: false}
});
//Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
