import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const removeFromWishlistSchema = j.object({
	params: j.object({
		product: validateObjectId.required(),
	}),
});

export const addToWishlistSchema = j.object({
	params: j.object({
		product: validateObjectId.required(),
	}),
});
