const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // L'utilisateur qui laisse la review
  reviewedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // L'utilisateur qui reçoit la review
  trip: { type: Schema.Types.ObjectId, ref: 'Trip' }, // Le voyage associé à la review
  car: { type: Schema.Types.ObjectId, ref: 'Car' }, // Le service associé à la review
  rating: { type: Number, min: 1, max: 5, required: true }, // Note de la review
  comment: { type: String, required: true }, // Commentaire de la review
  createdAt: { type: Date, default: Date.now } // Date de création de la review
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
