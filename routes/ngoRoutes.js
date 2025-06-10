import express from 'express';
import { getAllNgos } from '../controllers/ngoController.js';

const router = express.Router();

router.get('/', getAllNgos);

export default router;
