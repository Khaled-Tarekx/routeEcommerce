import User from '../../../database/user.model.js';
import { hash, genSalt } from 'bcrypt';
import Forbidden from '../../custom-errors/forbidden.js';
import { NotFound } from '../../custom-errors/main.js';
export const isResourceOwner = async (userId, resourceOwnerId) => {
	if (userId !== resourceOwnerId) {
		throw new Forbidden('you are not the resource owner');
	}
};

export const generateOTP = async () =>
	Math.floor(100000 + Math.random() * 900000);

export const validateOTP = async (userId, otpCode) => {
	const user = await User.findById(userId);
	if (!user || !user.otp || !user.otp.expiresAt) return false;
	if (Date.now() > user.otp.expiresAt.getTime()) {
		user.otp.code = null;
		user.otp.expiresAt = null;
		await user.save();
		return false;
	}

	try {
		const isMatch = user.otp.code === otpCode;
		if (isMatch) {
			user.otp.code = null;
			user.otp.expiresAt = null;
			await user.save();
		}
		return isMatch;
	} catch (err) {
		return false;
	}
};

export const hashPassword = async (password) => {
	try {
		const salt = await genSalt(10);
		return hash(password, salt);
	} catch (err) {
		throw new Error('error hashing password', err);
	}
};

export const findUserByEmail = async (email) => {
	const correctUser = await User.findOne({ email }).select({ password: -1 });
	if (!correctUser) {
		throw new NotFound('your email or password might be incorrect');
	}
	return correctUser;
};

export const checkEmailAndHash = async (email, password) => {
	const userExistsWithEmail = await User.findOne({ email });
	if (userExistsWithEmail) {
		return res
			.status(400)
			.json({ message: `a user already exists with the given email` });
	}
	const salt = await genSalt(10);
	const hashedPassword = await hash(password, salt);

	return hashedPassword;
};
