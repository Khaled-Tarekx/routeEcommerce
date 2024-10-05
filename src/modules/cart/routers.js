import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getLoggedInUserCart,
	updateCart,
	deleteCartItem,
	createCart,
} from './controllers.js';
import { createCartSchema, updateCartSchema } from './validation.js';

router
	.route('/')
	.get(getLoggedInUserCart)
	.post(validateResource(createCartSchema), createCart)
	.patch(validateResource(updateCartSchema), updateCart);

router.route('/:productId').delete(deleteCartItem);

export default router;
