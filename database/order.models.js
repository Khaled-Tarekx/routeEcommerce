import { model, Schema, Types } from 'mongoose';
export const Method = { cash: 'cash', credit: 'credit' };
export const Type = { percentage: 'percentage', fixed: 'fixed' };

const OrderSchema = new Schema(
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
		totalOrderPrice: Number,
		discount: Number,
		totalOrderAfterDiscount: Number,
		paymentMethod: {
			type: String,
			enums: [Method.cash, Method.credit],
			default: Method.cash,
		},
		shippingAddress: {
			city: String,
			street: String,
		},
		isPaid: { type: Boolean, default: false },
		paidAt: Date,
		isDelivered: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false }
);

const Order = model('Order', OrderSchema);
export default Order;
