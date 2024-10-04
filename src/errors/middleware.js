const ErrorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message;

	res.status(statusCode).json({
		status: 'error',
		statusCode,
		message,
	});
};

export default ErrorHandler;
