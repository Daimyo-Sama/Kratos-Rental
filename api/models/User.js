const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  profilePicture: { type: String },
  bio: { type: String },
  confirmed: { type: Boolean, default: false },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  account_level: { type: String, enum: ['client', 'owner'], default: 'client' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  paypalEmail: { type: String }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
