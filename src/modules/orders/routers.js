import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getLoggedInUserOrder,
	deleteLoggedInUserOrder,
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
	.get(getLoggedInUserOrder)
	.patch(validateResource(updateOrderAddressSchema), updateOrderAddress)
	.delete(deleteLoggedInUserOrder);

router.patch(
	'/:orderId',
	authorizeFor(['admin']),
	validateResource(updateOrderStatusSchema),
	updateOrderStatus
);

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
