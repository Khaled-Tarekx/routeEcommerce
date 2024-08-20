import { model, Schema } from 'mongoose';
export const Status = { active: 'active', inactive: 'inactive' };
export const Type = { percentage: 'percentage', fixed: 'fixed' };

const CouponSchema = new Schema(
	{
		code: {
			type: String,
			trim: true,
			unique: true,
		},
		expiredAt: Date,
		status: {
			type: Boolean,
			enum: Status,
			default: Status.active,
		},
		discount: {
			type: Number,
			min: 1,
			required: true,
		},
		type: {
			type: String,
			enum: Type,
			default: Type.fixed,
		},
	},
	{ timestamps: true, versionKey: false }
);

const Coupon = model('Coupon', CouponSchema);
export default Coupon;
