import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getLoggedInUserOrder,
	updateCart,
	createCashOrder,
} from './controllers.js';
import { createOrderSchema, updateOrderSchema } from './validation.js';

router
	.route('/')
	.get(getLoggedInUserOrder)
	.patch(validateResource(updateOrderSchema), updateCart);

router.post('/:cartId', validateResource(createOrderSchema), createCashOrder);

export default router;
