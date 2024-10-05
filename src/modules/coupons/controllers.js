import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Coupon from '../../../database/coupon.model.js';
import Forbidden from '../../custom-errors/forbidden.js';
import ApiFeatures from '../../utils/api_Features.js';
import QRCode from 'qrcode';

export const getCoupons = asyncHandler(async (req, res) => {
	const apiFeatrues = new ApiFeatures(Coupon.find({}), req.query)
		.sort()
		.paginate()
		.filter();

	const coupons = await apiFeatrues.mongooseQuery;
	res.status(StatusCodes.OK).json({ data: coupons });
});

export const getCouponById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const coupon = await Coupon.findById(id);
	if (!coupon) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'coupon doesnt exist' });
	}
	const url = await QRCode.toDataURL(coupon.code);

	res.status(StatusCodes.OK).json({ data: coupon, url });
});

export const updateCoupon = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { code, expiredAt, type, status, discount } = req.body;

	const couponToUpdate = await Coupon.findById(id);

	if (!couponToUpdate) {
		return res.status(404).json({ error: 'Coupon not found' });
	}

	const updatedCoupon = await Coupon.findByIdAndUpdate(
		couponToUpdate.id,
		{ code, expiredAt, type, status, discount },
		{ new: true }
	);

	if (!updatedCoupon) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ error: 'Coupon doesnt exist' });
	}

	res.status(StatusCodes.OK).json({ data: updatedCoupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const couponToDelete = await Coupon.findById(id);
	if (!couponToDelete) {
		return res.status(404).json({ error: 'Coupon doesnt exist' });
	}

	await couponToDelete.deleteOne();

	res.status(StatusCodes.OK).json({ message: 'coupon deleted successfully' });
});

export const createCoupon = asyncHandler(async (req, res, next) => {
	const { code, expiredAt, type, status, discount } = req.body;

	const coupon = await Coupon.create({
		code,
		expiredAt,
		type,
		status,
		discount,
	});

	res.status(StatusCodes.CREATED).json({ data: coupon });
});
