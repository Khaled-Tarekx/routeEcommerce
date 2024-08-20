import { model, Schema, Types } from 'mongoose';

const SupCategorySchema = new Schema(
	{
		name: {
			type: String,
			unique: [true, 'name must be unique'],
			trim: true,
			required: true,
			minLength: [2, 'sub category name is too short'],
		},
		slug: {
			type: String,
			lowercase: true,
			required: true,
		},
		category: { type: Types.ObjectId, ref: 'Category' },
		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);

const SubCategory = model('SubCategory', SupCategorySchema);
export default SubCategory;
