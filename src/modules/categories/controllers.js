import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import Category from '../../../database/category.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

export const getCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find({});
	res.status(StatusCodes.OK).json({ data: categories });
});

export const getCategoryByID = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'category doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const { name } = req.body;
	req.body.slug = slugify(name);

	const categoryToUpdate = await Category.findById(id);
	if (!categoryToUpdate) {
		return res.status(404).json({ error: 'category not found' });
	}

	try {
		console.log(categoryToUpdate.createdBy.toString());
		await isResourceOwner(user.id, categoryToUpdate.createdBy.toString());

		const updatedCategory = await Category.findByIdAndUpdate(
			categoryToUpdate.id,
			{ name, slug: req.body.slug },
			{ new: true }
		);
		if (!updatedCategory) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'category doesnt exist' });
		}
		res.status(StatusCodes.OK).json({ data: updatedCategory });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const deleteCategory = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const categoryToDelete = await Category.findById(id);
	if (!categoryToDelete) {
		return res.status(404).json({ error: 'category doesnt exist' });
	}
	try {
		await isResourceOwner(user.id, categoryToDelete.createdBy.toString());

		await Category.findByIdAndDelete(categoryToDelete.id);

		res
			.status(StatusCodes.OK)
			.json({ message: 'category deleted successfully' });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const createCategory = asyncHandler(async (req, res) => {
	const user = req.user;
	const { name } = req.body;
	req.body.slug = slugify(name);
	try {
		const category = await Category.create({
			name,
			slug: req.body.slug,
			createdBy: user.id,
		});
		if (!category) {
			return res.status(404).json({ error: 'category doesnt exist' });
		}
		res.status(StatusCodes.CREATED).json({ data: category });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
