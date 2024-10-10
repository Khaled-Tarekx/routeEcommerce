import asyncHandler from 'express-async-handler';
import {
	isResourceOwner,
	hashPassword,
	generateOTP,
} from '../auth/helpers.js';
import User from '../../../database/user.model.js';
import { StatusCodes } from 'http-status-codes';
import NotFound from '../../custom-errors/not-found.js';
import BadRequest from '../../custom-errors/bad-request.js';

export const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select('-password');
	res.status(StatusCodes.OK).json({ data: users });
});

export const getUserByID = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id).select('-password');
	if (!user) {
		return next(new NotFound('user doesnt exist'));
	}
	res.status(StatusCodes.OK).json({ data: user });
});

export const getMyUser = asyncHandler(async (req, res, next) => {
	const user = req.user;
	if (!user) {
		return next(new NotFound('try logging in first'));
	}
	const myUser = await User.findById(user._id).select('-password');
	if (!myUser) {
		return next(
			new NotFound('couldnt retrieve your user data try logging in')
		);
	}

	res.status(StatusCodes.OK).json({ data: myUser });
});

export const updateUser = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { name } = req.body;

	const updatedUser = await User.findByIdAndUpdate(
		user._id,
		{ name },
		{ new: true }
	).select('-password');

	if (!updatedUser) {
		return next(new NotFound('user not found'));
	}
	res.status(StatusCodes.OK).json({ data: updatedUser });
});

export const deleteUser = asyncHandler(async (req, res) => {
	const user = req.user;
	const userToDelete = await User.findByIdAndDelete(user._id);
	if (!userToDelete) {
		return next(new NotFound('user not found'));
	}

	res.status(StatusCodes.OK).json({ message: 'user deleted successfully' });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { password, confirmPassword } = req.body;
	if (password !== confirmPassword) {
		return next(new BadRequest('password and confirm password should match'));
	}
	const hashedPassword = await hashPassword(password);

	const userToUpdate = await User.findByIdAndUpdate(
		user._id,
		{ password: hashedPassword },
		{ new: true }
	);
	if (!userToUpdate) {
		return next(new NotFound('user doesnt exist'));
	}

	res
		.status(StatusCodes.OK)
		.json({ message: 'user password updated successfully' });
});
