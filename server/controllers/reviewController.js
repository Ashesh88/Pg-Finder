const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ listing: req.body.listing, tenant: req.user.id });
    if (existing) return res.status(400).json({ message: 'Review already submitted' });

    const review = await Review.create({ ...req.body, tenant: req.user.id });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).populate('tenant', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReview, getListingReviews };