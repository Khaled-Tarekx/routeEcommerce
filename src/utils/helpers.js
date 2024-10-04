import j from 'joi';
import { isValidObjectId } from 'mongoose';

const validateObjectId = j.string().custom((value, helpers) => {
	if (!isValidObjectId(value)) {
		return helpers.error('any.invalid');
	}
	return value;
}, 'MongoDB ObjectId validation');

export { validateObjectId };
