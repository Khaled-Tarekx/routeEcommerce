import j from 'joi';

export const updateBrandSchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
};

export const createBrandSchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
};
