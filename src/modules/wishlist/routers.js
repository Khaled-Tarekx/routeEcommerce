import express from 'express';
import { validateResource } from '../auth/middlewares.js';
const router = express.Router();
import {
	addToWishlist,
	removeFromWishlist,
	getLoggedInUserWishList,
} from './controllers.js';
import {
	addToWishlistSchema,
	removeFromWishlistSchema,
} from './validation.js';

router.get('/', getLoggedInUserWishList);

router
	.route('/:productId')
	.post(validateResource(addToWishlistSchema), addToWishlist)
	.patch(validateResource(removeFromWishlistSchema), removeFromWishlist);

export default router;
