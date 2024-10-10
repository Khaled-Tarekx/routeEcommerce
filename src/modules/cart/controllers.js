import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Cart from '../../../database/cart.model.js';
import Forbidden from '../../custom-errors/forbidden.js';
import Product from '../../../database/product.model.js';
import { updateCartPrice } from '../../utils/helpers.js';
import NotFound from '../../custom-errors/not-found.js';

export const getLoggedInUserCart = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const cart = await Cart.findOne({ owner: user._id });
	if (!cart) {
		return next(
			new NotFound(
				'you do not have a cart yet! start adding items to make one'
			)
		);
	}
	await updateCartPrice(cart);

	res.status(StatusCodes.OK).json({ data: cart });
});

export const updateCart = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { product } = req.body;

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

	await updateCartPrice(cartExists);

	updatedCart = await cartExists.save();
	res
		.status(StatusCodes.CREATED)
		.json({ message: 'quantity increased', data: updatedCart });
});

export const deleteCartItem = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { productId } = req.params;
	const cartToUpdate = await Cart.findOneAndUpdate(
		{ owner: user._id },
		{ $pull: { cartItems: { product: productId } } },
		{ new: true }
	);
	if (!cartToUpdate) {
		return next(
			new Forbidden(
				'user doesnt own a cart or didnt add the product yet to delete it'
			)
		);
	}
	await updateCartPrice(cartToUpdate);
	res.status(StatusCodes.OK).json({
		message: 'cart product removed successfully',
		data: cartToUpdate,
	});
});

export const createCart = asyncHandler(async (req, res, next) => {
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

		if (!cartExists) {
			const cart = await Cart.create({
				owner: user._id,
				cartItems: [req.body],
			});
			await updateCartPrice(cart);

			return res.status(StatusCodes.CREATED).json({ data: cart });
		}

		const item = cartExists.cartItems.find(
			(ele) => ele.product.toString() === product
		);
		let updatedCart;
		if (item) {
			item.quantity += 1;
		} else {
			updatedCart = await Cart.findOneAndUpdate(
				{ owner: user._id },
				{ $push: { cartItems: [req.body] } },
				{ new: true }
			);
			await updateCartPrice(updatedCart);

			return res
				.status(StatusCodes.CREATED)
				.json({ message: 'new item added', data: updatedCart });
		}

		await updateCartPrice(cartExists);
		if (cartExists.discount) {
			cartExists.totalPriceAfterDiscount =
				cartExists.totalPrice -
				(cartExists.totalPrice * cartExists.discount) / 100;
		}
		updatedCart = await cartExists.save();
		res
			.status(StatusCodes.CREATED)
			.json({ message: 'quantity increased', data: updatedCart });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
