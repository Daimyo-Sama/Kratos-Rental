const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    car: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Car'},
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    checkIn: {type:Date, required:true},
    checkOut: {type:Date, required:true},
    name: {type:String, required:true},
    phone: {type:String, required:true},
    price: Number,
    status: {
        type: String,
        enum: ["upcoming", "completed", "cancelled"],
        default: "upcoming",
      }
});

const TripModel = mongoose.model('Trip', tripSchema);

module.exports = TripModel;