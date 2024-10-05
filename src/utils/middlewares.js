import { BadRequest } from '../custom-errors/main.js';

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
			const errorDetails = err.details.map((detail) => detail.message);
			return next(new BadRequest(errorDetails));
		}
	};
};
