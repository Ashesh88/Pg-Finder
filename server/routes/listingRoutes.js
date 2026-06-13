const express = require('express');
const router = express.Router();
const { createListing, getAllListings, getListingById, updateListing, deleteListing } = require('../controllers/listingController');
const { protect, ownerOnly } = require('../middleware/auth');

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.post('/', protect, ownerOnly, createListing);
router.put('/:id', protect, ownerOnly, updateListing);
router.delete('/:id', protect, ownerOnly, deleteListing);

module.exports = router;