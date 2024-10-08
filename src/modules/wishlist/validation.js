import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const removeFromWishlistSchema = {
	params: j.object({
		productId: validateObjectId.required(),
	}),
};

export const addToWishlistSchema = {
	params: j.object({
		productId: validateObjectId.required(),
	}),
};
