const Listing = require('../models/Listing');

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, owner: req.user.id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    const { city, type, gender, furnishing, minRent, maxRent } = req.query;
    let filter = { isAvailable: true };

    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (gender) filter.gender = gender;
    if (furnishing) filter.furnishing = furnishing;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    const listings = await Listing.find(filter).populate('owner', 'name phone email');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name phone email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createListing, getAllListings, getListingById, updateListing, deleteListing };