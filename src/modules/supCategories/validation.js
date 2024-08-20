import j from 'joi';

export const updateSubCategorySchema = j.object({
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
});

export const createSubCategorySchema = j.object({
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
});
