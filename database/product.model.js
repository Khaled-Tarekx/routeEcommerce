import { model, Schema, Types } from 'mongoose';

const ProductSchema = new Schema(
	{
		title: {
			type: String,
			unique: [true, 'name must be unique'],
			trim: true,
			required: true,
			minLength: [2, 'brand name is too short'],
		},
		description: {
			type: String,
			trim: true,
			required: true,
			minLength: [50, 'description is too short'],
		},
		slug: {
			type: String,
			lowercase: true,
			required: true,
		},
		imageCover: String,
		images: [String],
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		priceAfterDiscount: {
			type: Number,
			min: 0,
		},
		sold: Number,

		stock: {
			type: Number,
			min: 0,
		},
		category: {
			type: Types.ObjectId,
			ref: 'Category',
		},
		subCategory: {
			type: Types.ObjectId,
			ref: 'SubCategory',
		},
		brand: {
			type: Types.ObjectId,
			ref: 'Brand',
		},
		rateCount: Number,
		rateAvg: Number,
		rate: {
			type: Number,
			min: 0,
			max: 5,
		},
		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

ProductSchema.virtual('reviews', {
	ref: 'Review',
	limit: 20,
	localField: '_id',
	foreignField: 'product',
});

ProductSchema.post('init', function (doc) {
	doc.imageCover = process.env.BASE_URL + 'uploads/' + doc.imageCover;
	if (doc.images) {
		doc.images = doc.images.map(
			(ele) => process.env.BASE_URL + 'uploads/' + ele
		);
	}
});

const Product = model('Product', ProductSchema);
export default Product;
