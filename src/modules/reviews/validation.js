import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const updateReviewSchema = {
	body: j.object({
		comment: j.string().trim(),
		rating: j.number().min(0).max(5).required(),
	}),
};

export const createReviewSchema = {
	body: j.object({
		comment: j.string().trim(),
		rating: j.number().min(0).max(5).required(),
		product: validateObjectId,
	}),
};
