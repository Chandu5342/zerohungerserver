import express from 'express';
import {
  createDonation,
  getDonationsByDonor,
  getAllDonations,
  updateDonationStatus,
  cancelDonation,
  updateDonationPhotos,
  acceptDonation 
} from '../controllers/donationController.js';

const router = express.Router();

// Create donation
router.post('/', createDonation);

// Get all donations for a specific donor
router.get('/donor/:donorId', getDonationsByDonor);

// ✅ Get all donations (for NGO dashboard)
router.get('/', getAllDonations);

// ✅ Update donation status (Accepted, Picked, Delivered)
router.put('/status/:id', updateDonationStatus);

// Cancel a donation
router.put('/cancel/:id', cancelDonation);
// Accept a donation (NGO)
router.put('/:id/accept', acceptDonation);

// Update photos (pickup/delivery)
router.put('/photos/:id', updateDonationPhotos);

export default router;
