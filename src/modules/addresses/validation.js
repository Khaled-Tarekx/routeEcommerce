import j from 'joi';

export const updateAddressSchema = j.object({
	body: j.object({
		street: j.string(),
		phone: j.string(),
		city: j.string(),
	}),
});

export const addAddressSchema = j.object({
	street: j.string().required(),
	phone: j.string().required(),
	city: j.string().required(),
});
