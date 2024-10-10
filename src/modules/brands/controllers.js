import asyncHandler from 'express-async-handler';
import Brand from '../../../database/brand.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import NotFound from '../../custom-errors/not-found.js';

export const getBrands = asyncHandler(async (req, res) => {
	const brands = await Brand.find({});
	res.status(StatusCodes.OK).json({ data: brands });
});

export const getBrandById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const brand = await Brand.findById(id);
	if (!brand) {
		return next(new NotFound('brand doesnt exist'));
	}
	res.status(StatusCodes.OK).json({ data: brand });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { name } = req.body;
	req.body.slug = slugify(name);
	const updatedBrand = await Brand.findByIdAndUpdate(
		{ _id: id },
		{ name, slug: req.body.slug, logo: req.file.filename },
		{ new: true }
	);

	if (!updatedBrand) {
		return next(new NotFound('brand doesnt exist'));
	}

	res.status(StatusCodes.OK).json({ data: updatedBrand });
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const brandToDelete = await Brand.findOneAndDelete({
		_id: id,
	});
	if (!brandToDelete) {
		return next(new NotFound('brand doesnt exist'));
	}

	res.status(StatusCodes.OK).json({ message: 'brand deleted successfully' });
});

export const createBrand = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { name } = req.body;
	req.body.slug = slugify(name);

	const brand = await Brand.create({
		name,
		slug: req.body.slug,
		createdBy: user._id,
		logo: req.file.filename,
	});
	if (!brand) {
		return next(new NotFound('brand doesnt exist'));
	}

	res.status(StatusCodes.CREATED).json({ data: brand });
});
