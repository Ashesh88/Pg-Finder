const Listing = require('../models/Listing');

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createListing = async (req, res) => {
  try {
    const { title, type, rent, address } = req.body;
    if (!title || !type || !rent || !address?.city) {
      return res.status(400).json({ message: 'Title, type, rent, and city are required fields' });
    }
    if (Number(rent) < 0) {
      return res.status(400).json({ message: 'Rent cannot be negative' });
    }

    const listing = await Listing.create({ ...req.body, owner: req.user.id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    const { city, type, gender, furnishing, minRent, maxRent, page = 1, limit = 50 } = req.query;
    let filter = { isAvailable: true };

    if (city && city.trim()) {
      filter['address.city'] = {
        $regex: `^${escapeRegExp(city.trim())}$`,
        $options: 'i',
      };
    }

    if (type) filter.type = type;
    if (gender) filter.gender = gender;
    if (furnishing) filter.furnishing = furnishing;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name phone email');

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .populate('owner', 'name phone email');
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
    if (!listing) return res.status(404).json({ message: 'Listing not found or unauthorized' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!listing) return res.status(404).json({ message: 'Listing not found or unauthorized' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
};
