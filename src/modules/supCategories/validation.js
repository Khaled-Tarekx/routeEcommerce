import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const updateSubCategorySchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
		image: j.string(),
	}),
};

export const createSubCategorySchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
		image: j.string(),
		category: validateObjectId,
	}),
};
