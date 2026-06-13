const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'responded', 'closed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);