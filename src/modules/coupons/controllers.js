import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Coupon, { Type } from '../../../database/coupon.model.js';
import ApiFeatures from '../../utils/api_Features.js';
import QRCode from 'qrcode';
import Cart from '../../../database/cart.model.js';
import NotFound from '../../custom-errors/not-found.js';
import Forbidden from '../../custom-errors/forbidden.js';

export const getCoupons = asyncHandler(async (req, res) => {
	const apiFeatrues = new ApiFeatures(Coupon.find({}), req.query)
		.sort()
		.paginate()
		.filter();

	const coupons = await apiFeatrues.mongooseQuery;
	res.status(StatusCodes.OK).json({ data: coupons });
});

export const getCouponById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const coupon = await Coupon.findById(id);
	if (!coupon) {
		return next(new NotFound('Coupon doesnt exist'));
	}
	const url = await QRCode.toDataURL(coupon.code);

	res.status(StatusCodes.OK).json({ data: coupon, url });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { code, expiredAt, type, status, discount } = req.body;

	const updatedCoupon = await Coupon.findByIdAndUpdate(
		id,
		{ code, expiredAt, type, status, discount },
		{ new: true }
	);

	if (!updatedCoupon) {
		return next(new NotFound('Coupon doesnt exist'));
	}

	res.status(StatusCodes.OK).json({ data: updatedCoupon });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const couponToDelete = await Coupon.findByIdAndDelete(id);
	if (!couponToDelete) {
		return next(new NotFound('Coupon doesnt exist'));
	}
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
	if (!coupon) {
		return next(new Forbidden('coupon creation failed'));
	}
	res.status(StatusCodes.CREATED).json({ data: coupon });
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
	const user = req.user;
	const { code } = req.params;
	const userMaxUsage = 1;
	const coupon = await Coupon.findOne({ code });
	const usedBefore = coupon.usersUsage.find((ele) =>
		ele.user.equals(user._id)
	);
	if (usedBefore && usedBefore.usageCount >= userMaxUsage) {
		return next(new NotFound('you already used this coupon once'));
	}
	if (!coupon) {
		return next(
			new NotFound('either the coupon expired or the code isnt correct')
		);
	}
	const cart = await Cart.findOne({ owner: user._id });
	if (!cart) {
		return next(
			new NotFound(
				'you didnt create a cart yet, add items to help us make your cart'
			)
		);
	}
	if (coupon.type === Type.fixed) {
		cart.totalPriceAfterDiscount = cart.totalPrice - coupon.discount;
		cart.discount = coupon.discount;
	} else {
		cart.totalPriceAfterDiscount =
			cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
		cart.discount = coupon.discount;
	}
	if (!usedBefore) {
		coupon.usersUsage.push({ user: user._id, usageCount: 1 });
	}
	await cart.save();

	await coupon.save();
	res.status(StatusCodes.CREATED).json({ data: cart });
});
