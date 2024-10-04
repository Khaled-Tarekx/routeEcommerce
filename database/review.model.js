import { model, Schema, Types } from 'mongoose';

const ReviewSchema = new Schema(
	{
		comment: {
			type: String,
			trim: true,
		},
		rating: {
			min: 0,
			type: Number,
			max: 5,
			required: true,
		},
		reviewer: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		product: {
			type: Types.ObjectId,
			ref: 'Product',
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

const Review = model('Review', ReviewSchema);
export default Review;
