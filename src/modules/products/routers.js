import express from 'express';
import { validateResource } from '../auth/middlewares.js';
const router = express.Router();
import {
	getProductById,
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
} from './controllers.js';
import { createProductSchema, updateProductSchema } from './validation.js';

router
	.route('/')
	.get(getProducts)
	.post(validateResource(createProductSchema), createProduct);

router
	.route('/:id')
	.patch(validateResource(updateProductSchema), updateProduct)
	.get(getProductById)
	.delete(deleteProduct);

export default router;
