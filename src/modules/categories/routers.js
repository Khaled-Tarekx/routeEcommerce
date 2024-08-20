import express from 'express';
import { validateResource } from '../auth/middlewares.js';
const router = express.Router();
import {
	getCategoryByID,
	getCategories,
	updateCategory,
	deleteCategory,
	createCategory,
} from './controllers.js';
import { updateCategorySchema, createCategorySchema } from './validation.js';

router
	.route('/')
	.get(getCategories)
	.post(validateResource(createCategorySchema), createCategory);

router
	.route('/:id')
	.patch(validateResource(updateCategorySchema), updateCategory)
	.get(getCategoryByID)
	.delete(deleteCategory);

export default router;
