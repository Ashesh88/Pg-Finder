const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['PG', 'flat', 'room'], required: true },
  gender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  rent: { type: Number, required: true },
  deposit: { type: Number },
  furnishing: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'], default: 'unfurnished' },
  address: {
    street: String,
    city: { type: String, required: true, index: true },
    state: String,
    pincode: String,
  },
  location: {
    type: { type: String },
    coordinates: { type: [Number], default: undefined },
  },
  images: [String],
  amenities: [String],
  isAvailable: { type: Boolean, default: true, index: true },
}, { timestamps: true });

// Compound index for optimized filtering
listingSchema.index({ 'address.city': 1, isAvailable: 1, rent: 1 });

module.exports = mongoose.model('Listing', listingSchema);
