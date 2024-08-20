import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import SubCategory from '../../../database/supCategory.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

export const getSubCategories = asyncHandler(async (req, res) => {
	const subCategories = await SubCategory.find({});
	res.status(StatusCodes.OK).json({ data: subCategories });
});

export const getSubCategoryByID = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const supCategory = await SubCategory.findById(id);
	if (!supCategory) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'sup category doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: supCategory });
});

export const updateSubCategory = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const { name } = req.body;
	req.body.slug = slugify(name);

	const subCategoryToUpdate = await SubCategory.findById(id);
	if (!subCategoryToUpdate) {
		return res.status(404).json({ error: 'category not found' });
	}
	try {
		await isResourceOwner(user.id, subCategoryToUpdate.createdBy.toString());

		const updatedSupCategory = await SubCategory.findByIdAndUpdate(
			subCategoryToUpdate.id,
			{ name, slug: req.body.slug },
			{ new: true }
		);
		if (!updatedSupCategory) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'sub category doesnt exist' });
		}

		res.status(StatusCodes.OK).json({ data: updatedSupCategory });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const subCategoryToDelete = await SubCategory.findById(id);
	if (!subCategoryToDelete) {
		return res.status(404).json({ error: 'category doesnt exist' });
	}
	try {
		await isResourceOwner(user.id, subCategoryToDelete.createdBy.toString());

		await SubCategory.findByIdAndDelete(subCategoryToDelete.id);

		res
			.status(StatusCodes.OK)
			.json({ message: 'sub category deleted successfully' });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const createSubCategory = asyncHandler(async (req, res) => {
	const user = req.user;
	const { name } = req.body;
	req.body.slug = slugify(name);
	try {
		const subCategory = await SubCategory.create({
			name,
			slug: req.body.slug,
			createdBy: user.id,
		});
		if (!subCategory) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'sub category doesnt exist' });
		}

		res.status(StatusCodes.CREATED).json({ data: subCategory });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
