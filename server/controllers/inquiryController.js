const Inquiry = require('../models/Inquiry');

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
    const inquiries = await Inquiry.find({ listing: req.params.listingId }).populate('tenant', 'name email phone');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createInquiry, getMyInquiries, getListingInquiries, updateInquiryStatus };