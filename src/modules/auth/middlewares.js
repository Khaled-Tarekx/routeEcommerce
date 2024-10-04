import jwt from 'jsonwebtoken';
import UnAuthenticated from '../../custom-errors/unauthenticated.js';
import User from '../../../database/user.model.js';

export const isAuthenticated = async (req, res, next) => {
	const { token } = req.headers;
	if (!token) {
		return res.status(400).json({ message: `please provide token` });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		const user = await User.findById(decoded.id);
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token', error: err });
	}
};

export const validateResource = (schema) => {
	return async (req, res, next) => {
		try {
			if (schema.body) {
				const requestData = {
					...req.body,
					...(req.files && { files: req.files }),
					...(req.file && { file: req.file }),
				};
				await schema.body.validateAsync(requestData, { abortEarly: false });
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

export const authorizeFor = (roles) => {
	return async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new UnAuthenticated('access denied'));
		}
		next();
	};
};
