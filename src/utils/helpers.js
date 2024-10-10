import j from 'joi';
import { isValidObjectId } from 'mongoose';

const validateObjectId = j.string().custom((value, helpers) => {
	if (!isValidObjectId(value)) {
		return helpers.error('any.invalid');
	}
	return value;
}, 'MongoDB ObjectId validation');

const updateCartPrice = async (cart) => {
	let totalPrice = 0;

	cart.cartItems.forEach((ele) => (totalPrice += ele.quantity * ele.price));
	cart.totalPrice = Number(totalPrice.toFixed(2));
	if (cart.discount) {
		const discountAmount = (cart.discount / 100) * totalPrice;
		cart.totalPriceAfterDiscount = Number(
			(cart.totalPrice - discountAmount).toFixed(2)
		);
	} else {
		cart.totalPriceAfterDiscount = totalPrice;
	}
	await cart.save();
};

export { validateObjectId, updateCartPrice };
