import { model, Schema, Types } from 'mongoose';
export const Status = { active: 'active', inactive: 'inactive' };
export const Type = { percentage: 'percentage', fixed: 'fixed' };

const CouponSchema = new Schema(
	{
		code: {
			type: String,
			trim: true,
			unique: true,
		},
		usersUsage: [
			{
				user: { type: Types.ObjectId, ref: 'User' },
				usageCount: { type: Number, default: 0 },
			},
		],
		expiredAt: { type: Date, required: true },
		status: {
			type: String,
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
