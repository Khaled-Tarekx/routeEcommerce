import { compare } from 'bcrypt';
import User from '../../../database/user.model.js';
import { validateOTP, hashPassword, findUserByEmail } from './helpers.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const register = asyncHandler(async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = await User.create({
			name,
			email,
			password,
		});
		const createdUser = await User.findById(user.id).select('-password');

		res
			.status(StatusCodes.CREATED)
			.json({ message: `user created successfully`, createdUser });
	} catch (err) {
		res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const login = asyncHandler(async (req, res) => {
	const { password, email } = req.body;
	const correctUser = await findUserByEmail(email);
	const CorrectPassword = compare(password, correctUser.password);
	if (!correctUser || !CorrectPassword) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.json({ message: `email or password is incorrect` });
	}
	const token = jwt.sign(
		{
			id: correctUser.id,
			isBlocked: correctUser.isBlocked,
			confirmEmail: correctUser.confirmEmail,
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
