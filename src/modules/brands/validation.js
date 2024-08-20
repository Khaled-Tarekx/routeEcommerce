import j from 'joi';

export const updateBrandSchema = j.object({
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
});

export const createBrandSchema = j.object({
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
});
