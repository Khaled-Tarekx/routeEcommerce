import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import User from '../../../database/user.model.js';
import BadRequest from '../../custom-errors/bad-request.js';
import NotFound from '../../custom-errors/not-found.js';

export const getLoggedInUserAddresses = asyncHandler(
	async (req, res, next) => {
		const user = req.user;
		const data = await User.findOne({ _id: user._id });
		if (!data) {
			return next(new NotFound('user not found'));
		}

		res.status(StatusCodes.OK).json({
			data: data.addresses,
		});
	}
);

export const addAddress = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { street, city, phone } = req.body;

	const userToUpdate = await User.findOneAndUpdate(
		{ _id: user._id },
		{ $push: { addresses: { street, city, phone } } },
		{ new: true }
	);
	if (!userToUpdate) {
		return next(new NotFound('couldnt add an address'));
	}
	res.status(StatusCodes.OK).json({
		message: `address was added to ${userToUpdate.name} successfully`,
	});
});

export const updateAddress = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { addressId } = req.params;
	const { street, city, phone } = req.body;

	const userToUpdate = await User.findOneAndUpdate(
		{
			_id: user._id,
			addresses: { $elemMatch: { _id: addressId } },
		},
		{
			$set: {
				'addresses.$.street': street,
				'addresses.$.city': city,
				'addresses.$.phone': phone,
			},
		},
		{ new: true }
	);

	if (!userToUpdate) {
		return next(
			new BadRequest('an error happened while updating the address')
		);
	}
	res.status(StatusCodes.OK).json({
		message: `address was updated to ${userToUpdate.name} successfully`,
	});
});

export const removeAddress = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { addressId } = req.params;

	const userToUpdate = await User.findOneAndUpdate(
		{ _id: user._id, addresses: { $elemMatch: { _id: addressId } } },
		{ $pull: { addresses: { _id: addressId } } },
		{ new: true }
	);

	if (!userToUpdate) {
		return next(
			new BadRequest('an error happened while deleting the address')
		);
	}

	res.status(StatusCodes.OK).json({
		message: `address was deleted from ${userToUpdate.name} successfully`,
	});
});
