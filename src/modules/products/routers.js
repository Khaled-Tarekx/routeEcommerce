import express from 'express';
import { validateResource } from '../../utils/middlewares.js';
import { authorizeFor } from '../auth/middlewares.js';

const router = express.Router();
import {
	getProductById,
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
} from './controllers.js';
import { createProductSchema, updateProductSchema } from './validation.js';
import { uploadFields } from '../../utils/uploads.js';

router
	.route('/')
	.get(getProducts)
	.post(
		uploadFields([
			{ name: 'imageCover', maxCount: 1 },
			{ name: 'images', maxCount: 5 },
		]),
		authorizeFor(['admin']),
		validateResource(createProductSchema),
		createProduct
	);

router
	.route('/:id')
	.patch(
		uploadFields([
			{ name: 'imageCover', maxCount: 1 },
			{ name: 'images', maxCount: 5 },
		]),
		authorizeFor(['admin']),

		validateResource(updateProductSchema),
		updateProduct
	)
	.get(getProductById)
	.delete(authorizeFor(['admin']), deleteProduct);

export default router;
