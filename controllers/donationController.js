import Donation from '../models/Donation.js';

// 1. Create Donation
export const createDonation = async (req, res) => {
  try {
    const {
      donorId,
      foodType,
      quantity,
      quantityUnit,
      expiryDate,
      pickupLocation,
    } = req.body;

    const missingFields = [];
    if (!donorId) missingFields.push('donorId');
    if (!foodType) missingFields.push('foodType');
    if (!quantity) missingFields.push('quantity');
    if (!expiryDate) missingFields.push('expiryDate');
    if (!pickupLocation) missingFields.push('pickupLocation');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: 'Missing required fields', missingFields });
    }

    const donation = new Donation({
      donorId,
      foodType,
      quantity,
      quantityUnit,
      expiryDate,
      pickupLocation,
    });

    const saved = await donation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating donation', error: err.message });
  }
};

// 2. Get Donations by Donor
export const getDonationsByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donations = await Donation.find({ donorId }).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donations', error: err.message });
  }
};

// ✅ 3. Get All Donations (For NGO Dashboard)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).populate('donorId', 'name email');
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all donations', error: err.message });
  }
};

// ✅ 4. Update Donation Status (Accept / Picked / Delivered)
export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending Pickup', 'Accepted', 'Picked', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await Donation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// 5. Cancel a Donation
export const cancelDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndUpdate(
      id,
      { status: 'Cancelled' },
      { new: true }
    );
    res.status(200).json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling donation', error: err.message });
  }
};

// 6. Upload Pickup/Delivery Photos
export const updateDonationPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const { photoPickup, photoDelivery } = req.body;

    const updated = await Donation.findByIdAndUpdate(
      id,
      {
        ...(photoPickup && { photoPickup }),
        ...(photoDelivery && { photoDelivery })
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating photos', error: err.message });
  }
};
// 5. Accept a Donation (NGO action)
export const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngoId } = req.body;

    if (!ngoId) {
      return res.status(400).json({ message: 'NGO ID is required to accept donation' });
    }

    const updated = await Donation.findByIdAndUpdate(
      id,
      { status: 'Accepted', acceptedBy: ngoId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error accepting donation', error: err.message });
  }
};
