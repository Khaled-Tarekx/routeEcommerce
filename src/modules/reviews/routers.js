import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getReviewById,
	updateReview,
	deleteReview,
	createReview,
} from './controllers.js';
import { createReviewSchema, updateReviewSchema } from './validation.js';

router.post('/', validateResource(createReviewSchema), createReview);

router
	.route('/:id')
	.patch(validateResource(updateReviewSchema), updateReview)
	.get(getReviewById)
	.delete(deleteReview);

export default router;
