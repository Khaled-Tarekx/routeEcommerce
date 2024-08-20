import express from 'express';
import { validateResource } from '../auth/middlewares.js';
const router = express.Router();
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

router
	.route('/')
	.get(getSubCategories)
	.post(validateResource(createSubCategorySchema), createSubCategory);

router
	.route('/:id')
	.patch(validateResource(updateSubCategorySchema), updateSubCategory)
	.get(getSubCategoryByID)
	.delete(deleteSubCategory);

export default router;
