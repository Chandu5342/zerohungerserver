import User from '../models/User.js';

// Get volunteers with 'underNgo' and 'pending' for a specific NGO
export const getVolunteerRequests = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const volunteers = await User.find({
      role: 'volunteer',
      volunteerType: 'underNgo',
      ngoId,
      ngoJoinStatus: 'pending'
    });

    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching volunteer requests', error: err.message });
  }
};

// Accept or reject volunteer request
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { status } = req.body; // expected: 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const volunteer = await User.findByIdAndUpdate(
      volunteerId,
      { ngoJoinStatus: status },
      { new: true }
    );

    res.status(200).json({ message: `Volunteer ${status}`, volunteer });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// Get volunteers assigned to this NGO who are available and accepted
export const getAvailableVolunteers = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const availableVolunteers = await User.find({
      role: 'volunteer',
      volunteerType: 'underNgo',
      ngoId,
      ngoJoinStatus: 'accepted',
      availability: 'available'
    });

    res.status(200).json(availableVolunteers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching available volunteers', error: err.message });
  }
};

// Update a volunteer's availability status
export const updateAvailability = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { availability } = req.body; // expected: 'available', 'busy', or 'offline'

    if (!['available', 'busy', 'offline'].includes(availability)) {
      return res.status(400).json({ message: 'Invalid availability value' });
    }

    const volunteer = await User.findByIdAndUpdate(
      volunteerId,
      { availability },
      { new: true }
    );

    res.status(200).json({ message: 'Availability updated', volunteer });
  } catch (err) {
    res.status(500).json({ message: 'Error updating availability', error: err.message });
  }
};
