import express from 'express';
import { authorizeFor, validateResource } from '../auth/middlewares.js';
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
		authorizeFor(['user', 'admin']),
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
		validateResource(updateProductSchema),
		updateProduct
	)
	.get(getProductById)
	.delete(deleteProduct);

export default router;
