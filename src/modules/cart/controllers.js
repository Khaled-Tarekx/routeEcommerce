import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import { StatusCodes } from 'http-status-codes';
import Cart from '../../../database/cart.model.js';
import Forbidden from '../../custom-errors/forbidden.js';
import Product from '../../../database/product.model.js';
import { updateCartPrice } from '../../utils/helpers.js';

export const getLoggedInUserCart = asyncHandler(async (req, res) => {
	const user = req.user;
	const cart = await Cart.findOne({ owner: user._id });
	updateCartPrice(cart);
	if (!cart) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'cart doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: cart });
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

export const deleteCartItem = asyncHandler(async (req, res) => {
	const user = req.user;
	const { productId } = req.params;
	try {
		const cartToUpdate = await Cart.findOneAndUpdate(
			{ owner: user._id },
			{ $pull: { cartItems: { product: productId } } },
			{ new: true }
		);
		updateCartPrice(cartToUpdate);
		res.status(StatusCodes.OK).json({
			message: 'cart product removed successfully',
			data: cartToUpdate,
		});
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
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
			updateCartPrice(cart);

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

			updateCartPrice(updatedCart);
			return res
				.status(StatusCodes.CREATED)
				.json({ message: 'new item added', data: updatedCart });
		}

		updateCartPrice(cartExists);

		updatedCart = await cartExists.save();
		res
			.status(StatusCodes.CREATED)
			.json({ message: 'quantity increased', data: updatedCart });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
