import { genSalt, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../database/user.model.js';

export const checkEmailAndHash = async (req, res, next) => {
	const { email, password, mobileNumber } = req.body;
	const userExistsWithEmail = await User.findOne({ email });
	if (userExistsWithEmail) {
		return res
			.status(400)
			.json({ message: `a user already exists with the given email` });
	}
	const salt = await genSalt(10);
	req.body.password = await hash(password, salt);
	next();
};

export const isAuthenticated = async (req, res, next) => {
	const { token } = req.headers;
	if (!token) {
		return res.status(400).json({ message: `please provide token` });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token', error: err });
	}
};

export const validateResource = (schema) => {
	return async (req, res, next) => {
		try {
			if (schema.body) {
				await schema.body.validateAsync(req.body, { abortEarly: false });
			}
			if (schema.params) {
				await schema.params.validateAsync(req.params, { abortEarly: false });
			}
			if (schema.query) {
				await schema.query.validateAsync(req.query, { abortEarly: false });
			}
			next();
		} catch (err) {
			res.status(400).json(err.details);
		}
	};
};
