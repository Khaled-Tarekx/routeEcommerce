import { model, Schema, Types } from 'mongoose';

const BrandSchema = new Schema(
	{
		name: {
			type: String,
			unique: [true, 'name must be unique'],
			trim: true,
			required: true,
			minLength: [2, 'brand name is too short'],
		},
		slug: {
			type: String,
			lowercase: true,
			required: true,
		},
		logo: String,
		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);

const Brand = model('Brand', BrandSchema);
export default Brand;
