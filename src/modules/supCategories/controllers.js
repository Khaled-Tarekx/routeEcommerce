import asyncHandler from 'express-async-handler';
import SubCategory from '../../../database/supCategory.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import NotFound from '../../custom-errors/not-found.js';

export const getSubCategories = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;
	const subCategories = await SubCategory.find({ category: categoryId });
	res.status(StatusCodes.OK).json({ data: subCategories });
});

export const getSubCategoryByID = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const supCategory = await SubCategory.findById(id);
	if (!supCategory) {
		return next(new NotFound('sup category doesnt exist'));
	}
	res.status(StatusCodes.OK).json({ data: supCategory });
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name } = req.body;
	req.body.slug = slugify(name);

	const subCategoryToUpdate = await SubCategory.findByIdAndUpdate(
		id,
		{ name, slug: req.body.slug, image: req.file.filename },
		{ new: true }
	);

	if (!subCategoryToUpdate) {
		return next(new NotFound('category not found'));
	}

	res.status(StatusCodes.OK).json({ data: subCategoryToUpdate });
});

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const subCategoryToDelete = await SubCategory.findByIdAndDelete(id);
	if (!subCategoryToDelete) {
		return next(new NotFound('category not found'));
	}

	res
		.status(StatusCodes.OK)
		.json({ message: 'sub category deleted successfully' });
});

export const createSubCategory = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { name, category } = req.body;
	req.body.slug = slugify(name);
	const subCategory = await SubCategory.create({
		name,
		category,
		slug: req.body.slug,
		createdBy: user._id,
		image: req.file.filename,
	});
	if (!subCategory) {
		return next(new NotFound('sub category doesnt exist'));
	}

	res.status(StatusCodes.CREATED).json({ data: subCategory });
});
