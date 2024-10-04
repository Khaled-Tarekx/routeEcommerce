import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const updateReviewSchema = j.object({
	body: j.object({
		comment: j.string().trim(),
		rating: j.number().min(0).max(5).required(),
	}),
});

export const createReviewSchema = j.object({
	body: j.object({
		comment: j.string().trim(),
		rating: j.number().min(0).max(5).required(),
		product: validateObjectId,
	}),
});
