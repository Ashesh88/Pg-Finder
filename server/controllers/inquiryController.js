const Inquiry = require('../models/Inquiry');
const Listing = require('../models/Listing');

const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      tenant: req.user.id
    });
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ tenant: req.user.id }).populate('listing', 'title address rent');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getListingInquiries = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Authorization Guard: Only the listing's owner can view its inquiries
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this listing' });
    }

    const inquiries = await Inquiry.find({ listing: req.params.listingId }).populate('tenant', 'name email phone');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('listing');
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Authorization Guard: Only the owner of the listing can change inquiry status
    if (inquiry.listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You do not own this listing' });
    }

    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createInquiry, getMyInquiries, getListingInquiries, updateInquiryStatus };
