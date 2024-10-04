import asyncHandler from 'express-async-handler';
import { isResourceOwner } from '../auth/helpers.js';
import { StatusCodes } from 'http-status-codes';
import Review from '../../../database/review.model.js';
import Forbidden from '../../custom-errors/forbidden.js';
import ApiFeatures from '../../utils/api_Features.js';

export const getReviews = asyncHandler(async (req, res) => {
	const apiFeatrues = new ApiFeatures(Review.find({}), req.query)
		.sort()
		.paginate()
		.filter();

	const reviews = await apiFeatrues.mongooseQuery.populate({
		path: 'reviewer',
		select: 'name',
	});
	res.status(StatusCodes.OK).json({ data: reviews });
});

export const getReviewById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const review = await Review.findById(id).populate({
		path: 'reviewer',
		select: 'name',
	});
	if (!review) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'review doesnt exist' });
	}
	res.status(StatusCodes.OK).json({ data: review });
});

export const updateReview = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const { comment, product, rating } = req.body;

	const reviewToUpdate = await Review.findById(id);

	if (!reviewToUpdate) {
		return res.status(404).json({ error: 'review not found' });
	}

	try {
		await isResourceOwner(user.id, reviewToUpdate.reviewer.toString());

		const updatedReview = await Review.findByIdAndUpdate(
			reviewToUpdate.id,
			{ comment, product, rating },
			{ new: true }
		);

		if (!updatedReview) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'review doesnt exist' });
		}

		res.status(StatusCodes.OK).json({ data: updatedReview });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const deleteReview = asyncHandler(async (req, res) => {
	const user = req.user;
	const { id } = req.params;
	const reviewToDelete = await Review.findById(id);
	if (!reviewToDelete) {
		return res.status(404).json({ error: 'review doesnt exist' });
	}
	try {
		await isResourceOwner(user.id, reviewToDelete.reviewer.toString());

		await Review.findByIdAndDelete(reviewToDelete._id);

		res
			.status(StatusCodes.OK)
			.json({ message: 'review deleted successfully' });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});

export const createReview = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { comment, product, rating } = req.body;
	try {
		const alreadyReviewd = await Review.findOne({
			reviewer: user.id,
			product,
		});

		if (alreadyReviewd) {
			return next(new Forbidden('you already reviewd this product'));
		}

		const review = await Review.create({
			comment,
			product,
			rating,
			reviewer: user.id,
		});

		res.status(StatusCodes.CREATED).json({ data: review });
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({ err: err.message });
	}
});
