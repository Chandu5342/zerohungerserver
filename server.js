// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import donationRoutes from './routes/donationRoutes.js'; // ✅ Add donation routes
import volunteerRoutes from './routes/volunteerRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/donations', donationRoutes); // ✅ Attach donation API routes
app.use('/api/volunteers', volunteerRoutes);

// Basic route to check server
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
