import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import Brand from '../../../database/brand.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

export const getBrands = asyncHandler(async (req, res) => {
	const brands = await Brand.find({});
	res.status(StatusCodes.OK).json({ data: brands });
});

export const getBrandById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const brand = await Brand.findById(id);
	if (!brand) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: ' brand doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: brand });
});

export const updateBrand = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const { name } = req.body;
	req.body.slug = slugify(name);

	const brandToUpdate = await Brand.findById(id);
	if (!brandToUpdate) {
		return res.status(404).json({ error: 'brand not found' });
	}
	try {
		await isResourceOwner(user.id, brandToUpdate.createdBy.toString());

		const updatedBrand = await Brand.findByIdAndUpdate(
			brandToUpdate.id,
			{ name, slug: req.body.slug },
			{ new: true }
		);

		if (!updatedBrand) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'brand doesnt exist' });
		}

		res.status(StatusCodes.OK).json({ data: updatedBrand });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const deleteBrand = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const brandToDelete = await Brand.findById(id);
	if (!brandToDelete) {
		return res.status(404).json({ error: 'brand doesnt exist' });
	}
	try {
		await isResourceOwner(user.id, brandToDelete.createdBy.toString());

		await Brand.findByIdAndDelete(brandToDelete.id);

		res
			.status(StatusCodes.OK)
			.json({ message: 'brand deleted successfully' });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const createBrand = asyncHandler(async (req, res) => {
	const user = req.user;
	const { name } = req.body;
	req.body.slug = slugify(name);
	try {
		const brand = await Brand.create({
			name,
			slug: req.body.slug,
			createdBy: user.id,
		});
		if (!brand) {
			return res.status(404).json({ error: 'brand doesnt exist' });
		}

		res.status(StatusCodes.CREATED).json({ data: brand });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
