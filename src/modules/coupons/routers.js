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

router
	.route('/')
	.get(getCoupons)
	.post(validateResource(createCouponSchema), createCoupon);

router
	.route('/:id')
	.patch(validateResource(updateCouponSchema), updateCoupon)
	.get(getCouponById)
	.delete(deleteCoupon);
router.post('/:code', applyCoupon);
export default router;
