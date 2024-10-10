import {
	handleDBErrors,
	isDBError,
	sendErrorForDev,
	sendErrorForProd,
} from './helpers.js';

const ErrorHandler = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500;
	const isDbError = isDBError(error);
	if (process.env.NODE_ENV === 'development') {
		if (isDbError) {
			const dbError = handleDBErrors(error);
			return sendErrorForDev(dbError, res);
		}
		return sendErrorForDev(error, res);
	} else if (process.env.NODE_ENV === 'production') {
		if (isDbError) {
			const dbError = handleDBErrors(error);
			return sendErrorForProd(dbError, res);
		}
		return sendErrorForProd(error, res);
	}
	next();
};

export default ErrorHandler;
