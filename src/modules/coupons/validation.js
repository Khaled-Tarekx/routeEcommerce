import j from 'joi';
import { Status, Type } from '../../../database/coupon.model.js';

export const updateCouponSchema = {
	body: j.object({
		code: j.string().trim(),
		expiredAt: j.date().min('now').messages({
			'date.min': 'Expiration date cannot be in the past.',
			'date.base': 'Expiration date must be a valid date.',
		}),
		status: j.string().valid(Status.active, Status.inactive),
		type: j.string().valid(Type.percentage, Type.fixed),
		discount: j.number().min(1),
	}),
};

export const createCouponSchema = {
	body: j.object({
		code: j.string().trim().required(),
		expiredAt: j.date().min('now').required().messages({
			'date.min': 'Expiration date cannot be in the past.',
			'date.base': 'Expiration date must be a valid date.',
		}),
		status: j.string().valid(Status.active, Status.inactive).required(),
		type: j.string().valid(Type.percentage, Type.fixed).required(),
		discount: j.number().min(1).required(),
	}),
};
