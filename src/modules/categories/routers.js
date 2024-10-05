import express from 'express';
import { validateResource } from '../../utils/middlewares.js';
import {
	getCategoryByID,
	getCategories,
	updateCategory,
	deleteCategory,
	createCategory,
} from './controllers.js';
import { updateCategorySchema, createCategorySchema } from './validation.js';
import subcategoryRouter from '../supCategories/routers.js';
import { uploadSingle } from '../../utils/uploads.js';

const categoryRouter = express.Router();

categoryRouter.use('/:categoryId/sub-categories', subcategoryRouter);

categoryRouter
	.route('/')
	.get(getCategories)
	.post(
		uploadSingle('image'),
		validateResource(createCategorySchema),
		createCategory
	);

categoryRouter
	.route('/:id')
	.patch(
		uploadSingle('image'),
		validateResource(updateCategorySchema),
		updateCategory
	)
	.get(getCategoryByID)
	.delete(deleteCategory);

export default categoryRouter;
