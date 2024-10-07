import j from 'joi';

export const updateOrderSchema = {
	body: j.object({
		shippingAddress: j.object({
			city: j.string().required(),
			street: j.string().required(),
		}),
	}),
};

export const createOrderSchema = {
	body: j.object({
		shippingAddress: j.object({
			city: j.string().required(),
			street: j.string().required(),
		}),
	}),
};
