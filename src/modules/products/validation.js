import j from 'joi';
import { validateObjectId } from '../../utils/helpers.js';

export const updateProductSchema = {
	body: j.object({
		title: j.string().trim().min(2),
		description: j.string().trim().min(50),
		slug: j.string().trim().lowercase(),
		price: j.number().min(0).required(),
		priceAfterDiscount: j.number().min(0).optional().less(j.ref('price')),
		imageCover: j.array().items(
			j.object({
				fieldname: j.string().required(),
				originalname: j.string().required(),

				encoding: j.string().required(),

				mimetype: j.string().required(),

				destination: j.string().required(),

				filename: j.string().required(),
				path: j.string().required(),

				size: j.number().required(),
			})
		),
		images: j.array().items(
			j.object({
				fieldname: j.string().required(),
				originalname: j.string().required(),

				encoding: j.string().required(),

				mimetype: j.string().required(),

				destination: j.string().required(),

				filename: j.string().required(),
				path: j.string().required(),

				size: j.number().required(),
			})
		),
	}),
};

export const createProductSchema = {
	body: j.object({
		category: validateObjectId.required(),
		subCategory: validateObjectId.required(),
		brand: validateObjectId.required(),
		title: j.string().trim().min(2).required(),
		description: j.string().trim().min(50).required(),
		slug: j.string().trim().lowercase(),
		price: j.number().min(0).required(),
		priceAfterDiscount: j.number().min(1).optional().less(j.ref('price')),
		imageCover: j.array().items(
			j.object({
				fieldname: j.string().required(),
				originalname: j.string().required(),

				encoding: j.string().required(),

				mimetype: j.string().required(),

				destination: j.string().required(),

				filename: j.string().required(),
				path: j.string().required(),

				size: j.number().required(),
			})
		),
		images: j.array().items(
			j.object({
				fieldname: j.string().required(),
				originalname: j.string().required(),

				encoding: j.string().required(),

				mimetype: j.string().required(),

				destination: j.string().required(),

				filename: j.string().required(),
				path: j.string().required(),

				size: j.number().required(),
			})
		),
	}),
};
