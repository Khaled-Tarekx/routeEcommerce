import j from 'joi';

export const updateBrandSchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
		logo: j.string(),
	}),
};

export const createBrandSchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
		logo: j.string(),
	}),
};
