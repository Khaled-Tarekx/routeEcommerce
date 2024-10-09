import express from 'express';

const router = express.Router();
import { stripeWebhook } from './controllers.js';

router.post('/', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
