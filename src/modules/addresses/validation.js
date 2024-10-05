import j from 'joi';

export const updateAddressSchema = {
	body: j.object({
		street: j.string(),
		phone: j.string(),
		city: j.string(),
	}),
};

export const addAddressSchema = {
	street: j.string().required(),
	phone: j.string().required(),
	city: j.string().required(),
};
