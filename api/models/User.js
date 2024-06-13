const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: {type:String, unique:true, required:true},
    password: String,
    confirmed: { type: Boolean, default: false } // email confirmation
})

const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;