import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Order, { Method } from '../../../database/order.models.js';
import Forbidden from '../../custom-errors/forbidden.js';
import Product from '../../../database/product.model.js';
import { updateCartPrice } from '../../utils/helpers.js';
import Cart from '../../../database/cart.model.js';
import NotFound from '../../custom-errors/not-found.js';

export const getLoggedInUserOrder = asyncHandler(async (req, res) => {
	const user = req.user;
	const order = await Order.findOne({ owner: user._id });
	if (!order) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'order doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: order });
});

export const updateCart = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { product } = req.body;

	try {
		const productData = await Product.findById(product).select('price');
		if (!productData) {
			return next(new Forbidden('product wasnt found'));
		}
		req.body.price = productData.price;
		const cartExists = await Cart.findOne({
			owner: user._id,
		});

		const item = cartExists.cartItems.find(
			(ele) => ele.product.toString() === product
		);
		let updatedCart;
		if (!item) {
			return next(new Forbidden('product doesnt exist'));
		}
		item.quantity = req.body.quantity;

		updateCartPrice(cartExists);

		updatedCart = await cartExists.save();
		res
			.status(StatusCodes.CREATED)
			.json({ message: 'quantity increased', data: updatedCart });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const createCashOrder = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { cartId } = req.params;
	const { shippingAddress } = req.body;
	const cart = await Cart.findById(cartId);
	if (!cart) {
		return next(new NotFound('create your own cart then start ordering'));
	}
	let totalOrderPrice;

	if (cart.totalPriceAfterDiscount) {
		totalOrderPrice = cart.totalPriceAfterDiscount;
	}
	totalOrderPrice = cart.totalPrice;

	const order = await Order.create({
		owner: user._id,
		cartItems: cart.cartItems,
		totalOrderPrice,
		shippingAddress,
		paymentMethod: Method.cash,
	});

	if (order) {
		const bulkOptions = cart.cartItems.map((ele) => ({
			updateOne: {
				filter: { _id: ele.product, stock: { $gte: ele.quantity } },
				update: { $inc: { stock: -ele.quantity, sold: ele.quantity } },
			},
		}));
		const result = await Product.bulkWrite(bulkOptions);
		if (result.modifiedCount < cart.cartItems.length) {
			const failedItems = cart.cartItems.filter(
				(_, index) => !result.modifiedCount[index]
			);
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Some items in your cart are out of stock',
				failedItems: failedItems,
			});
		}
		await cart.deleteOne();
		return res.status(StatusCodes.OK).json({ data: order });
	}

	res
		.status(StatusCodes.BAD_REQUEST)
		.json({ message: 'order creation wasnt successfull' });
});
