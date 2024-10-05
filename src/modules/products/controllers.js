import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import Product from '../../../database/product.model.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import ApiFeatures from '../../utils/api_Features.js';

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

export const getProductById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id).populate({
		path: 'reviews',

		populate: { path: 'reviewer', select: 'name' },
	});
	if (!product) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'Product doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const {
		title,
		description,
		price,
		priceAfterDiscount,
		imageCover,
		images,
	} = req.body;
	req.body.slug = slugify(title);
	if (imageCover) imageCover = req.files.imageCover[0].filename;
	if (images) images = req.files.images.map((ele) => ele.filename);
	const productToUpdate = await Product.findById(id);
	if (!productToUpdate) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'Product doesnt exist' });
	}
	try {
		await isResourceOwner(user.id, productToUpdate.createdBy.toString());

		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{
				title,
				slug: req.body.slug,
				description,
				price,
				priceAfterDiscount,
				imageCover,
				images,
			},
			{
				new: true,
			}
		);
		if (!updatedProduct) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'Product doesnt exist' });
		}

		res.status(StatusCodes.OK).json({ data: updatedProduct });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const deleteProduct = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;

	const productToDelete = await Product.findById(id);
	if (!productToDelete) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'Product doesnt exist' });
	}
	try {
		await isResourceOwner(user.id, productToDelete.createdBy.toString());

		await Product.findByIdAndDelete(productToDelete.id);
		res
			.status(StatusCodes.OK)
			.json({ message: 'Product deleted successfully' });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const createProduct = asyncHandler(async (req, res) => {
	const user = req.user;
	const {
		title,
		description,
		price,
		priceAfterDiscount,
		category,
		subCategory,
		brand,
	} = req.body;
	req.body.slug = slugify(title);
	const imageCover = req.files.imageCover[0].filename;
	const images = req.files.images.map((ele) => ele.filename);
	try {
		const product = await Product.create({
			title,
			description,
			slug: req.body.slug,
			imageCover,
			images,
			price,
			priceAfterDiscount,
			category,
			subCategory,
			brand,
			createdBy: user.id,
		});

		res.status(StatusCodes.CREATED).json({ data: product });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
