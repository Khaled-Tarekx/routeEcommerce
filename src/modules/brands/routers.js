import express from 'express';
import { validateResource } from '../auth/middlewares.js';
const router = express.Router();
import {
	getBrandById,
	getBrands,
	updateBrand,
	deleteBrand,
	createBrand,
} from './controllers.js';
import { createBrandSchema, updateBrandSchema } from './validation.js';

router
	.route('/')
	.get(getBrands)
	.post(validateResource(createBrandSchema), createBrand);

router
	.route('/:id')
	.patch(validateResource(updateBrandSchema), updateBrand)
	.get(getBrandById)
	.delete(deleteBrand);

export default router;
