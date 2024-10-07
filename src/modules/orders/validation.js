import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const updateOrderStatusSchema = {
	params: j.object({
		orderId: validateObjectId,
	}),
	body: j.object({
		isPaid: j.boolean(),
		isDelivered: j.boolean(),
	}),
};

export const createCashOrderSchema = {
	params: j.object({
		cartId: validateObjectId,
	}),

	body: j.object({
		shippingAddress: j.object({
			city: j.string().required(),
			street: j.string().required(),
		}),
	}),
};

export const updateOrderAddressSchema = {
	body: j.object({
		shippingAddress: j.object({
			city: j.string().required(),
			street: j.string().required(),
		}),
	}),
};

export const createOnlinePaymentOrderSchema = {
	params: j.object({
		cartId: validateObjectId,
	}),
	body: j.object({
		shippingAddress: j.object({
			city: j.string().required(),
			street: j.string().required(),
		}),
	}),
};
