import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Review from '../../../database/review.model.js';
import Forbidden from '../../custom-errors/forbidden.js';
import NotFound from '../../custom-errors/not-found.js';

export const getReviewById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const review = await Review.findById(id).populate({
		path: 'reviewer',
		select: 'name',
	});
	if (!review) {
		return next(new NotFound('review doesnt exist'));
	}
	res.status(StatusCodes.OK).json({ data: review });
});

export const updateReview = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { id } = req.params;
	const { comment, product, rating } = req.body;

	const reviewToUpdate = await Review.findOneAndDelete(
		{
			_id: id,
			reviewer: user._id,
		},
		{ comment, product, rating },
		{ new: true }
	);

	if (!reviewToUpdate) {
		return next(new NotFound('review not found'));
	}
	res.status(StatusCodes.OK).json({ data: reviewToUpdate });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { id } = req.params;
	const reviewToDelete = await Review.findOneAndDelete({
		_id: id,
		reviewer: user._id,
	});

	if (!reviewToDelete) {
		return next(new NotFound('review not found'));
	}

	res.status(StatusCodes.OK).json({ message: 'review deleted successfully' });
});

export const createReview = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { comment, product, rating } = req.body;
	const alreadyReviewd = await Review.findOne({
		reviewer: user._id,
		product,
	});

	if (alreadyReviewd) {
		return next(new Forbidden('you already reviewd this product'));
	}

	try {
		const review = await Review.create({
			comment,
			product,
			rating,
			reviewer: user._id,
		});

		res.status(StatusCodes.CREATED).json({ data: review });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
