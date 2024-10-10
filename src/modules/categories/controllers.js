import asyncHandler from 'express-async-handler';
import Category from '../../../database/category.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import NotFound from '../../custom-errors/not-found.js';

export const getCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find({});
	res.status(StatusCodes.OK).json({ data: categories });
});

export const getCategoryByID = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		return next(new NotFound('category doesnt exist'));
	}
	res.status(StatusCodes.OK).json({ data: category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name } = req.body;
	req.body.slug = slugify(name);

	const categoryToUpdate = await Category.findOneAndUpdate(
		{ _id: id },
		{ name, slug: req.body.slug, image: req.file.filename },
		{ new: true }
	);

	if (!categoryToUpdate) {
		return next(new NotFound('category doesnt exist'));
	}

	res.status(StatusCodes.OK).json({ data: categoryToUpdate });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const categoryToDelete = await Category.findByIdAndDelete(id);

	if (!categoryToDelete) {
		return next(new NotFound('category doesnt exist'));
	}

	res
		.status(StatusCodes.OK)
		.json({ message: 'category deleted successfully' });
});

export const createCategory = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { name } = req.body;
	req.body.slug = slugify(name);
	const category = await Category.create({
		name,
		slug: req.body.slug,
		createdBy: user.id,
		image: req.file.filename,
	});

	if (!category) {
		return next(new NotFound('category doesnt exist'));
	}

	res.status(StatusCodes.CREATED).json({ data: category });
});
