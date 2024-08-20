import { model, Schema, Types } from 'mongoose';

const CategorySchema = new Schema(
	{
		name: {
			type: String,
			unique: [true, 'name must be unique'],
			trim: true,
			required: true,
			minLength: [2, 'category name is too short'],
		},
		slug: {
			type: String,
			lowercase: true,
			required: true,
		},
		image: String,

		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);

const Category = model('Category', CategorySchema);
export default Category;
