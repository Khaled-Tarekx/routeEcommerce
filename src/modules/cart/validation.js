import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const updateCartSchema = {
	body: j.object({
		quantity: j.number().min(0).required(),
		product: validateObjectId,
	}),
};

export const createCartSchema = {
	body: j.object({
		product: validateObjectId,
	}),
};
