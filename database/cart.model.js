import { model, Schema, Types } from 'mongoose';

const CartSchema = new Schema(
	{
		owner: {
			type: Types.ObjectId,
			ref: 'User',
		},
		cartItems: [
			{
				product: { type: Types.ObjectId, ref: 'Product' },
				quantity: { type: Number, default: 1 },
				price: { type: Number, requried: true },
			},
		],
		totalPrice: Number,
		discount: {
			type: Number,
			min: 1,
		},
		totalPriceAfterDiscount: Number,
	},
	{ timestamps: true, versionKey: false }
);

const Cart = model('Cart', CartSchema);
export default Cart;
