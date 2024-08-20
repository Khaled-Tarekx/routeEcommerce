import j from 'joi';

export const updateProductSchema = j.object({
	body: j.object({
		title: j.string().trim().min(2),
		description: j.string().trim().min(50),
		slug: j.string().trim().lowercase(),
		price: j.number().min(0).required(),
		priceAfterDiscount: j.number().min(0).optional().less(j.ref('price')),
	}),
});

export const createProductSchema = j.object({
	body: j.object({
		title: j.string().trim().min(2).required(),
		description: j.string().trim().min(50).required(),
		slug: j.string().trim().lowercase(),
		price: j.number().min(0).required(),
		priceAfterDiscount: j.number().min(1).optional().less(j.ref('price')),
	}),
});
