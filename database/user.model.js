import { model, Schema, Types } from 'mongoose';
export const Role = {
	user: 'user',
	admin: 'admin',
};

const UserSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			minLength: [2, 'sub category name is too short'],
		},
		email: { type: String, required: true, unique: true },
		password: String,
		role: {
			type: String,
			enum: Role,
			default: Role.user,
		},
		confirmEmail: {
			type: Boolean,
			default: false,
		},
		wishlist: [
			{
				type: Types.ObjectId,
				ref: 'Product',
			},
		],
		addresses: [
			{
				_id: { type: Types.ObjectId, auto: true },
				city: String,
				street: String,
				phone: String,
			},
		],
		isBlocked: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

const User = model('User', UserSchema);
export default User;
