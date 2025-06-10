// authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// ✅ Correct usage
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
