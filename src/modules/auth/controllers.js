import { compare } from 'bcrypt';
import User from '../../../database/user.model.js';
import {
	validateOTP,
	hashPassword,
	findUserByEmail,
	checkEmailAndHash,
	generateOTP,
} from './helpers.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import UnAuthenticated from '../../custom-errors/unauthenticated.js';
import NotFound from '../../custom-errors/not-found.js';

export const register = asyncHandler(async (req, res) => {
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

export const forgetPassword = asyncHandler(async (req, res, next) => {
	const { newPassword, confirmPassword, otpCode, email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return next(new NotFound('User not found'));
	}
	const isValid = await validateOTP(user._id, otpCode);
	if (!isValid) {
		return next(
			new UnAuthenticated('your otp is either not correct or expired')
		);
	}
	if (newPassword !== confirmPassword) {
		return next(
			new UnAuthenticated('password and confirm password should match')
		);
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

export const generateOtp = asyncHandler(async (req, res, next) => {
	const OTP = await generateOTP();
	const convertedOTP = OTP.toString();
	const expiresIn = 10 * 60 * 1000;
	const { id } = req.params;
	const userToUpdate = await User.findByIdAndUpdate(
		id,
		{
			otp: {
				expiresAt: new Date(Date.now() + expiresIn),
				code: convertedOTP,
			},
		},
		{ new: true }
	);

	if (!userToUpdate) {
		return next(new NotFound('user doesnt exist'));
	}

	res.status(StatusCodes.CREATED).json({ otpCode: convertedOTP });
});
