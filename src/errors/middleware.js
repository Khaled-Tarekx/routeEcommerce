const ErrorHandler = (error, req, res) => {
	const statusCode = error.statusCode || 500;
	res.status(statusCode).json({ error: error.message });
};

export default ErrorHandler;
