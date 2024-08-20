import asyncHandler from 'express-async-handler';
import {
	isResourceOwner,
	hashPassword,
	generateOTP,
} from '../auth/helpers.js';
import User from '../../../database/user.model.js';

export const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.status(200).json({ data: users });
});

export const getUserByID = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({ error: 'user doesnt exist' });
	}
	res.status(200).json({ data: user });
});

export const getMyUser = asyncHandler(async (req, res) => {
	const user = req.user;
	const myUser = await User.findById(user.id);
	if (!myUser) {
		return res.status(404).json({ error: 'user doesnt exist' });
	}

	res.status(200).json({ data: myUser });
});

export const updateUser = asyncHandler(async (req, res) => {
	const user = req.user;
	const { name } = req.body;

	const userToUpdate = await User.findById(user.id);
	if (!userToUpdate) {
		return res.status(404).json({ error: 'user not found' });
	}

	await isResourceOwner(user.id, userToUpdate.id);

	const updatedUser = await User.findByIdAndUpdate(
		userToUpdate.id,
		{ name },
		{ new: true }
	).select('-password');
	if (!updatedUser) {
		return res.status(404).json({ error: 'user doesnt exist' });
	}

	res.status(200).json({ data: updatedUser });
});

export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.user;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({ error: 'user doesnt exist' });
	}
	if (!isResourceOwner(id, user.id)) {
		return res.status(400).json({ error: 'you are not the user owner' });
	}
	await User.findByIdAndDelete(user.id);

	res.status(200).json({ message: 'user deleted successfully' });
});

export const updatePassword = asyncHandler(async (req, res) => {
	const user = req.user;
	const { password, confirmPassword } = req.body;
	if (password !== confirmPassword) {
		return res
			.status(400)
			.json({ error: 'password and confirm password should match' });
	}
	const hashedPassword = await hashPassword(password);

	const userToUpdate = await User.findByIdAndUpdate(
		id,
		{ hashedPassword },
		{ new: true }
	);
	if (!userToUpdate) {
		return res.status(404).json({ error: 'user doesnt exist' });
	}
	await isResourceOwner(user.id, userToUpdate.id);

	res.status(200).json({ message: 'user password updated successfully' });
});

export const generateOtp = asyncHandler(async (req, res) => {
	const OTP = await generateOTP();
	const convertedOTP = OTP.toString();
	const expiresIn = 10 * 60 * 1000;
	const user = req.user;
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
		return res.status(404).json({ error: 'user doesnt exist' });
	}
	await isResourceOwner(user.id, userToUpdate.id);

	res.status(201).json({ otpCode: convertedOTP });
});
