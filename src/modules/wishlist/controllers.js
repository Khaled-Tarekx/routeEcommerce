import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import User from '../../../database/user.model.js';
import Product from '../../../database/product.model.js';
import NotFound from '../../custom-errors/not-found.js';
import BadRequest from '../../custom-errors/bad-request.js';

export const getLoggedInUserWishList = asyncHandler(
	async (req, res, next) => {
		const user = req.user;
		const data = await User.findById(user._id).populate({
			path: 'wishlist',
		});

		if (!data) {
			return next(new NotFound('user not found'));
		}

		res.status(StatusCodes.OK).json({
			data: data.wishlist,
		});
	}
);

export const addToWishlist = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { productId } = req.params;
	const product = await Product.findById(productId);
	if (!product) {
		return next(new NotFound('product not found'));
	}
	const userToUpdate = await User.findOneAndUpdate(
		{ _id: user._id, wishlist: { $nin: [product._id] } },
		{ $addToSet: { wishlist: product._id } },
		{ new: true }
	);

	if (!userToUpdate) {
		return next(
			new BadRequest('you already added that product to your wishlist')
		);
	}

	res.status(StatusCodes.OK).json({
		message: `product ${product.title} added to wishlist successfully`,
	});
});

export const removeFromWishlist = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { productId } = req.params;
	const product = await Product.findById(productId);
	if (!product) {
		return next(new NotFound('product not found'));
	}
	const userToUpdate = await User.findOneAndUpdate(
		{ _id: user._id, wishlist: { $in: [product._id] } },
		{ $pull: { wishlist: product._id } },
		{ new: true }
	);

	if (!userToUpdate) {
		return next(
			new BadRequest(
				'you either removed that product from your wishlist or you didnt add it yet'
			)
		);
	}

	res.status(StatusCodes.OK).json({
		message: `product ${product.title} removed from wishlist successfully`,
	});
});
