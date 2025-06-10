import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['donor', 'ngo', 'volunteer', 'sponsor', 'admin'],
    default: 'donor',
  },
  volunteerType: {
    type: String,
    enum: ['independent', 'underNgo'],
    default: null,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline',
  },
  ngoJoinStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema); // ✅ make sure this exists

export default User; // ✅ use "export default"
