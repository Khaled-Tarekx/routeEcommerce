import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Order, { Method } from '../../../database/order.models.js';
import Forbidden from '../../custom-errors/forbidden.js';
import Product from '../../../database/product.model.js';
import Cart from '../../../database/cart.model.js';
import NotFound from '../../custom-errors/not-found.js';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const deleteLoggedInUserOrder = asyncHandler(async (req, res) => {
	const user = req.user;
	const order = await Order.findOneAndDelete({ owner: user._id });
	if (!order) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'order doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
	const { orderId } = req.params;
	const { isPaid, isDelivered } = req.body;

	const order = await Order.findOneAndUpdate(
		{ _id: orderId },
		{ isPaid, isDelivered },
		{ new: true }
	);

	if (!order) {
		return next(new Forbidden('cannot find the order you wish to update'));
	}

	res.status(StatusCodes.CREATED).json({ data: order });
});

export const updateOrderAddress = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { shippingAddress } = req.body;

	const order = await Order.findOneAndUpdate(
		{ owner: user._id },
		{ shippingAddress },
		{ new: true }
	);

	if (!order) {
		return next(new Forbidden('you have to order first then update it'));
	}

	res.status(StatusCodes.CREATED).json({ data: order });
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
	} else {
		totalOrderPrice = cart.totalPrice;
	}

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

export const createOnlinePaymentOrder = asyncHandler(
	async (req, res, next) => {
		const user = req.user;
		const { cartId } = req.params;
		const { shippingAddress } = req.body;

		const cart = await Cart.findOne({ _id: cartId });
		if (!cart) {
			return next(new NotFound('create your own cart then start ordering'));
		}
		let totalOrderPrice;

		if (cart.totalPriceAfterDiscount) {
			totalOrderPrice = cart.totalPriceAfterDiscount;
		} else {
			totalOrderPrice = cart.totalPrice;
		}

		let session;

		try {
			session = await stripe.checkout.sessions.create({
				mode: 'payment',
				success_url: 'http://localhost:3000/',
				cancel_url: 'http://localhost:3000/api/v1/cart/',
				customer_email: user.email,
				client_reference_id: cart.id,
				metadata: shippingAddress,
				line_items: [
					{
						price_data: {
							currency: 'egp',
							unit_amount: Math.round(totalOrderPrice * 100),
							product_data: {
								name: user.name,
							},
						},
						quantity: 1,
					},
				],
			});
		} catch (error) {
			return next(new Forbidden(error));
		}

		res.status(StatusCodes.OK).json({ data: session });
	}
);
