import jwt from 'jsonwebtoken';
import UnAuthenticated from '../../custom-errors/unauthenticated.js';
import User from '../../../database/user.model.js';

export const isAuthenticated = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		return res.status(400).json({ message: `please provide token` });
	}
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		const user = await User.findOne({ _id: decoded.id });
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token', error: err });
	}
};

export const authorizeFor = (roles) => {
	return async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new UnAuthenticated('access denied'));
		}
		next();
	};
};
