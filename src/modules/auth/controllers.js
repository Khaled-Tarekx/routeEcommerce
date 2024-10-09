import { compare } from 'bcrypt';
import User from '../../../database/user.model.js';
import {
	validateOTP,
	hashPassword,
	findUserByEmail,
	checkEmailAndHash,
} from './helpers.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import UnAuthenticated from '../../custom-errors/unauthenticated.js';

export const register = asyncHandler(async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const hashedPassword = await checkEmailAndHash(email, password);
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});
		const createdUser = await User.findById(user.id).select('-password');

		res
			.status(StatusCodes.CREATED)
			.json({ message: `user created successfully`, createdUser });
	} catch (err) {
		res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const login = asyncHandler(async (req, res, next) => {
	const { password, email } = req.body;
	const correctUser = await findUserByEmail(email);
	const correctPassword = await compare(password, correctUser.password);

	if (!correctPassword) {
		return next(
			new UnAuthenticated('your email or password might be incorrect')
		);
	}
	const token = jwt.sign(
		{
			id: correctUser._id,
			isBlocked: correctUser.isBlocked,
			confirmEmail: correctUser.confirmEmail,
			role: correctUser.role,
		},
		process.env.SECRET_KEY
	);
	res
		.status(StatusCodes.OK)
		.json({ message: `user logged in successfully`, token });
});

export const forgetPassword = asyncHandler(async (req, res) => {
	const { newPassword, confirmPassword, otpCode, email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'User not found' });
	}
	const isValid = await validateOTP(user.id, otpCode);
	if (!isValid) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ error: 'your otp is either not correct or expired' });
	}
	if (newPassword !== confirmPassword) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ error: 'password and confirm password should match' });
	}
	const hashedPassword = await hashPassword(newPassword);
	const updatedUser = await User.findByIdAndUpdate(
		user.id,
		{ password: hashedPassword },
		{ new: true }
	).select('-password -otp');
	res.status(StatusCodes.CREATED).json({
		message: `new user password has been set successfully`,
		updatedUser,
	});
});

export const stripeWebhook = asyncHandler(async (req, res, next) => {
	const sig = req.headers['stripe-signatrue'];
	let event;
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.WEBHOOK_SECRET
		);
	} catch (err) {
		return next(new Forbidden(err.message));
	}

	if (event.type === 'checkout.session.completed') {
		const sessionData = event.data.object;
		const cart = await Cart.findById(sessionData.client_reference_id);
		if (!cart) {
			return next(new NotFound('create your own cart then start ordering'));
		}
		const user = await User.findOne({
			email: sessionData.customer_email,
		});
		if (!user) {
			return next(new NotFound('no user found with that email'));
		}
		const order = await Order.create({
			owner: user._id,
			cartItems: cart.cartItems,
			totalOrderPrice: sessionData.amount_total / 100,
			shippingAddress: sessionData.metadata,
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
		} else {
			return next(new Forbidden(`Unhandled event type ${event.type}`));
		}

		response.json({ data: event, message: 'done' });
	}
});
