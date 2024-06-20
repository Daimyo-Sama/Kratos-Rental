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
        enum: ["upcoming", "unpaid", "confirmed", "ongoing", "completed", "cancelled"],
        default: "upcoming",
      },
    userStatus: {
      type: String,
      enum: ["inprogress", "archived", "deleted"],
      default: "inprogress",
    },
    ownerStatus: {
      type: String,
      enum: ["inprogress", "archived", "deleted"],
      default: "inprogress",
    }
});

const TripModel = mongoose.model('Trip', tripSchema);

module.exports = TripModel;