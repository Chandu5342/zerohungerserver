import User from '../models/User.js';

export const getAllNgos = async (req, res) => {
  try {
    // Find users with role 'ngo' and return id and username (or name)
    const ngos = await User.find({ role: 'ngo' }).select('_id username');
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch NGOs', error: error.message });
  }
};
