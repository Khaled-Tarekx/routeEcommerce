import j from 'joi';

export const updateCategorySchema = j.object({
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
});

export const createCategorySchema = j.object({
	body: j.object({
		name: j.string().required().trim().min(2),
		//TODO: file
	}),
});
