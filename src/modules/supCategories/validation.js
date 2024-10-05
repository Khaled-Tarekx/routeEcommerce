import j from 'joi';

export const updateSubCategorySchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
};

export const createSubCategorySchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
};
