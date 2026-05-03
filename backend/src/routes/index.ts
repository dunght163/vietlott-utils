import { Router } from 'express';
import drawsRouter from './draws.js';
import { getHealth } from '../controllers/healthController.js';

const router = Router();

router.get('/health', getHealth);
router.use('/draws', drawsRouter);

export default router;
