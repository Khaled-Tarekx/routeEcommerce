import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getCouponById,
	getCoupons,
	updateCoupon,
	deleteCoupon,
	createCoupon,
	applyCoupon,
} from './controllers.js';
import { createCouponSchema, updateCouponSchema } from './validation.js';
import { authorizeFor } from '../auth/middlewares.js';

router
	.route('/')
	.get(authorizeFor(['admin']), getCoupons)
	.post(
		authorizeFor(['admin']),
		validateResource(createCouponSchema),
		createCoupon
	);

router
	.route('/:id')
	.patch(
		authorizeFor(['admin']),
		validateResource(updateCouponSchema),
		updateCoupon
	)
	.get(authorizeFor(['admin']), getCouponById)
	.delete(authorizeFor(['admin']), deleteCoupon);
router.post('/:code', applyCoupon);
export default router;
