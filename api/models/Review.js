const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  reviewedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: Schema.Types.ObjectId, ref: 'Trip' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
