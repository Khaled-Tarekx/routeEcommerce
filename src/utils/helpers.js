import j from 'joi';
import { isValidObjectId } from 'mongoose';

const validateObjectId = j.string().custom((value, helpers) => {
	if (!isValidObjectId(value)) {
		return helpers.error('any.invalid');
	}
	return value;
}, 'MongoDB ObjectId validation');

const updateCartPrice = (cart) => {
	let totalPrice = 0;

	cart.cartItems.forEach((ele) => (totalPrice += ele.quantity * ele.price));
	cart.totalPrice = totalPrice;
};

export { validateObjectId, updateCartPrice };
