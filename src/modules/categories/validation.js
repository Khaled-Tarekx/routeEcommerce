import j from 'joi';

export const updateCategorySchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
};

export const createCategorySchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
		//TODO: file
	}),
};
