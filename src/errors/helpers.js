import CustomError from '../custom-errors/custom-error.js';
import { StatusCodes } from 'http-status-codes';

const handleDuplicateFieldErrorDB = (err) => {
	const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)?.[0];
	const message = `Duplicate field value: ${value} please use another value`;
	return new CustomError(message, StatusCodes.BAD_REQUEST);
};

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path} => ${err.value}`;
	return new CustomError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((element) => element.message);
	const message = `Invalid input data ${errors}`;
	return new CustomError(message, StatusCodes.BAD_REQUEST);
};

const sendErrorForDev = (error, res) => {
	return res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
		error,
		stack: error.stack,
	});
};

const sendErrorForProd = (error, res) => {
	return res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
	});
};

export const isDBError = (err) => {
	return (
		err.name === 'CastError' ||
		err.code === 11000 ||
		err.name === 'ValidationError'
	);
};

const handleDBErrors = (err) => {
	if (err.name === 'CastError') {
		return handleCastErrorDB(err);
	} else if (err.code === 11000) {
		return handleDuplicateFieldErrorDB(err);
	} else if (err.name === 'ValidationError') {
		return handleValidationErrorDB(err);
	} else {
		return null;
	}
};

export { handleDBErrors, sendErrorForProd, sendErrorForDev };
