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
		image: String,
		category: { type: Types.ObjectId, ref: 'Category' },
		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);

SupCategorySchema.post('init', function (doc) {
	doc.image = process.env.BASE_URL + 'uploads/' + doc.image;
});
const SubCategory = model('SubCategory', SupCategorySchema);
export default SubCategory;
