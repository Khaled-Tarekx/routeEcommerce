import express from 'express';
import { validateResource } from '../../utils/middlewares.js';
const router = express.Router();
import {
	getBrandById,
	getBrands,
	updateBrand,
	deleteBrand,
	createBrand,
} from './controllers.js';
import { uploadSingle } from '../../utils/uploads.js';

import { createBrandSchema, updateBrandSchema } from './validation.js';

router
	.route('/')
	.get(getBrands)
	.post(
		uploadSingle('logo'),
		validateResource(createBrandSchema),
		createBrand
	);

router
	.route('/:id')
	.patch(
		uploadSingle('logo'),
		validateResource(updateBrandSchema),
		updateBrand
	)
	.get(getBrandById)
	.delete(deleteBrand);

export default router;
