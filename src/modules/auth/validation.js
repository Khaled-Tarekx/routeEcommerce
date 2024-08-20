import j from 'joi';

export const registerValidation = j.object({
	body: j.object({
		name: j.string().required(),

		email: j
			.string()
			.required()
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
		password: j.string().min(5),
		confirmPassword: j.ref('password'),
	}),
});

export const loginValidation = j.object({
	body: j.object({
		email: j
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

		password: j.string().min(5).required(),
	}),
});

export const forgetPasswordValidation = j.object({
	body: j.object({
		email: j
			.string()
			.required()
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
		password: j.string().min(5).required(),
		confirmPassword: j
			.string()
			.valid(j.ref('password'))
			.required()
			.messages({ 'any.only': 'Passwords do not match' }),
		otpCode: j.string().max(6).required(),
	}),
});
