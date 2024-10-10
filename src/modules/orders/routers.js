import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getLoggedInUserOrders,
	getOrderById,
	deleteOrderById,
	updateOrderAddress,
	updateOrderStatus,
	createCashOrder,
	createOnlinePaymentOrder,
} from './controllers.js';
import {
	createCashOrderSchema,
	createOnlinePaymentOrderSchema,
	updateOrderAddressSchema,
	updateOrderStatusSchema,
} from './validation.js';
import { authorizeFor } from '../auth/middlewares.js';

router
	.route('/')
	.get(getLoggedInUserOrders)
	.patch(validateResource(updateOrderAddressSchema), updateOrderAddress);

router
	.route('/:orderId')
	.patch(
		authorizeFor(['admin']),
		validateResource(updateOrderStatusSchema),
		updateOrderStatus
	)
	.get(getOrderById)
	.delete(deleteOrderById);

router.post(
	'/:cartId',
	validateResource(createCashOrderSchema),
	createCashOrder
);

router.post(
	'/checkout/:cartId',
	validateResource(createOnlinePaymentOrderSchema),
	createOnlinePaymentOrder
);

export default router;
