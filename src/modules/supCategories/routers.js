import express from 'express';
import { validateResource } from '../auth/middlewares.js';

import {
	getSubCategoryByID,
	getSubCategories,
	updateSubCategory,
	deleteSubCategory,
	createSubCategory,
} from './controllers.js';
import {
	createSubCategorySchema,
	updateSubCategorySchema,
} from './validation.js';
import { uploadSingle } from '../../utils/uploads.js';

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(getSubCategories)
	.post(
		uploadSingle('image'),
		validateResource(createSubCategorySchema),
		createSubCategory
	);

router
	.route('/:id')
	.patch(
		uploadSingle('image'),
		validateResource(updateSubCategorySchema),
		updateSubCategory
	)
	.get(getSubCategoryByID)
	.delete(deleteSubCategory);

export default router;
