import express from 'express';
import {
  getVolunteerRequests,
  updateVolunteerStatus,
  getAvailableVolunteers,
  updateAvailability
} from '../controllers/volunteerController.js';

const router = express.Router();

// Get all pending volunteer requests for an NGO
router.get('/requests/:ngoId', getVolunteerRequests);

// Update volunteer status (accept/reject)
router.put('/:volunteerId/status', updateVolunteerStatus);

// Get all accepted & available volunteers for an NGO
router.get('/available/:ngoId', getAvailableVolunteers);

// Update a volunteer's availability
router.put('/:volunteerId/availability', updateAvailability);

export default router;
