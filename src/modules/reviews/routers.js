import express from 'express';
import { validateResource } from '../auth/middlewares.js';
const router = express.Router();
import {
	getReviewById,
	getReviews,
	updateReview,
	deleteReview,
	createReview,
} from './controllers.js';
import { createReviewSchema, updateReviewSchema } from './validation.js';

router
	.route('/')
	.get(getReviews)
	.post(validateResource(createReviewSchema), createReview);

router
	.route('/:id')
	.patch(validateResource(updateReviewSchema), updateReview)
	.get(getReviewById)
	.delete(deleteReview);

export default router;
