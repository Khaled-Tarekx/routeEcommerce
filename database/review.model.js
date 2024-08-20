import { model, Schema, Types } from 'mongoose';

const ReviewSchema = new Schema(
	{
		comment: {
			type: String,
			trim: true,
		},
		rate: {
			min: 0,
			type: Number,
			max: 5,
			required: true,
		},
		reviewer: {
			type: Types.ObjectId,
			ref: 'User',
		},
		product: {
			type: Types.ObjectId,
			ref: 'Product',
		},
	},
	{ timestamps: true, versionKey: false }
);

const Review = model('Review', ReviewSchema);
export default Review;
