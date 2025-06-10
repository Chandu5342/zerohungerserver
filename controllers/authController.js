import User from '../models/User.js'; // ✅ MUST use default import

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register controller
export const registerUser = async (req, res) => {
  try {
    console.log('Incoming Register Data:', req.body); // 👈 Add this
    const { username, email, password, role, volunteerType, ngoId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Validate NGO if volunteer is underNgo
    if (role === 'volunteer' && volunteerType === 'underNgo') {
      if (!ngoId)
        return res.status(400).json({ message: 'NGO selection is required for volunteers under NGO' });

      const ngo = await User.findOne({ _id: ngoId, role: 'ngo' });
      if (!ngo)
        return res.status(400).json({ message: 'Selected NGO does not exist' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUserData = {
      username,
      email,
      password: hashedPassword,
      role,
    };

    // Add volunteer-specific fields
    if (role === 'volunteer') {
      newUserData.volunteerType = volunteerType || null;
      newUserData.ngoId = volunteerType === 'underNgo' ? ngoId : null;
      newUserData.availability = 'offline';
      newUserData.ngoJoinStatus = volunteerType === 'underNgo' ? 'pending' : null;
    }

    // Save user
    const newUser = new User(newUserData);
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        volunteerType: newUser.volunteerType,
        ngoId: newUser.ngoId,
        availability: newUser.availability,
        ngoJoinStatus: newUser.ngoJoinStatus,
      },
    });
  } catch (err) {
      console.error('Error during registration:', err); // 👈 Add this
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with token and user data
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        volunteerType: user.volunteerType,
        availability: user.availability,
        ngoJoinStatus: user.ngoJoinStatus,
        ngoId: user.ngoId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
