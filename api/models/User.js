const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  profilePicture: { type: String },
  bio: { type: String },
  confirmed: { type: Boolean, default: false }, // email confirmation
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // reference to reviews
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
