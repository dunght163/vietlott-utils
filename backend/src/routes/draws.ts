import { Router } from 'express';
import * as drawController from '../controllers/drawController.js';

const router = Router();

router.get('/', drawController.listDraws);
router.get('/range-options', drawController.listDrawRangeOptions);

export default router;
