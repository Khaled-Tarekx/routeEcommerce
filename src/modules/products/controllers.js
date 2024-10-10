import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import Product from '../../../database/product.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import ApiFeatures from '../../utils/api_Features.js';
import NotFound from '../../custom-errors/not-found.js';

export const getProducts = asyncHandler(async (req, res) => {
	const apiFeatrues = new ApiFeatures(Product.find({}, req.query))
		.sort()
		.filter()
		.paginate();

	const products = await apiFeatrues.mongooseQuery.populate({
		path: 'reviews',
		populate: { path: 'reviewer', select: 'name' },
	});
	res.status(StatusCodes.OK).json({ data: products, count: products.length });
});

export const getProductById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findById(id).populate({
		path: 'reviews',

		populate: { path: 'reviewer', select: 'name' },
	});
	if (!product) {
		return next(new NotFound('Product doesnt exist'));
	}
	res.status(StatusCodes.OK).json({ data: product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { title, description, price, priceAfterDiscount, stock } = req.body;

	if (title) {
		req.body.slug = slugify(title);
	}
	let files = {};

	if (req.files.imageCover) {
		files.imageCover = req.files.imageCover[0].filename;
	}
	if (req.files.images) {
		files.images = req.files.images.map((ele) => ele.filename);
	}

	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: id },
		{
			title,
			slug: req.body.slug,
			description,
			price,
			priceAfterDiscount,
			...files,
			stock,
		},
		{
			new: true,
		}
	);
	if (!updatedProduct) {
		return next(new NotFound('Product doesnt exist'));
	}

	res.status(StatusCodes.OK).json({ data: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const deletedProduct = await Product.findOneAndDelete({
		_id: id,
	});
	if (!deletedProduct) {
		return next(new NotFound('Product doesnt exist'));
	}

	res
		.status(StatusCodes.OK)
		.json({ message: 'Product deleted successfully' });
});

export const createProduct = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const {
		title,
		description,
		price,
		priceAfterDiscount,
		category,
		subCategory,
		brand,
		stock,
	} = req.body;

	req.body.slug = slugify(title);

	let files = {};

	if (req.files.imageCover) {
		files.imageCover = req.files.imageCover[0].filename;
	}
	if (req.files.images) {
		files.images = req.files.images.map((ele) => ele.filename);
	}

	const product = await Product.create({
		title,
		description,
		slug: req.body.slug,
		...files,
		price,
		priceAfterDiscount,
		category,
		subCategory,
		brand,
		stock,
		createdBy: user._id,
	});

	if (!product) {
		return next(new NotFound('Product creation failed'));
	}

	res.status(StatusCodes.CREATED).json({ data: product });
});
