const express = require('express');
const router = express.Router();
const { createInquiry, getMyInquiries, getListingInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { protect, ownerOnly } = require('../middleware/auth');

router.post('/', protect, createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/listing/:listingId', protect, ownerOnly, getListingInquiries);
router.put('/:id', protect, ownerOnly, updateInquiryStatus);

module.exports = router;