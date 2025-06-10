import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  foodType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  quantityUnit: {
    type: String,
    default: 'kgs'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending Pickup',
    enum: ['Pending Pickup', 'Accepted', 'Picked', 'Delivered', 'Cancelled']
  },
  photoPickup: {
    type: String,
    default: ''
  },
  photoDelivery: {
    type: String,
    default: ''
  }
  ,
  acceptedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User', // assuming NGO is also stored in User collection
  default: null
}
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
