import j from 'joi';

export const updateUserSchema = {
	body: j.object({
		name: j.string().required().trim().min(2),
	}),
};

export const updatePasswordSchema = {
	body: j.object({
		password: j.string().min(5).required(),
		confirmPassword: j
			.string()
			.valid(j.ref('password'))
			.required()
			.messages({ 'any.only': 'Passwords do not match' }),
	}),
};
