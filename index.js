import 'dotenv/config';

import express from 'express';
import bootstrap from './src/setup/bootstrap.js';
import { connection } from './database/connection.js';
import Forbidden from './src/custom-errors/forbidden.js';
import { stripe } from './src/modules/orders/controllers.js';
import Order from './database/order.models.js';
import Cart from './database/cart.model.js';
import User from './database/user.model.js';
import NotFound from './src/custom-errors/not-found.js';
import Product from './database/product.model.js';

const app = express();
const port = process.env.PORT || 3000;

connection
	.then(() => console.log('connented to db successfully'))
	.catch(() => console.log('connection to db didnt work'));

app.post(
	'api/v1/webhook',
	express.raw({ type: 'application/json' }),
	async (req, res, next) => {
		const sig = req.headers['stripe-signatrue'];
		let event;
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				sig,
				process.env.WEBHOOK_SECRET
			);
		} catch (err) {
			return next(new Forbidden(err.message));
		}

		if (event.type === 'checkout.session.completed') {
			const sessionData = event.data.object;
			const cart = await Cart.findById(sessionData.client_reference_id);
			if (!cart) {
				return next(new NotFound('create your own cart then start ordering'));
			}
			const user = await User.findOne({
				email: sessionData.customer_email,
			});
			if (!user) {
				return next(new NotFound('no user found with that email'));
			}
			const order = await Order.create({
				owner: user._id,
				cartItems: cart.cartItems,
				totalOrderPrice: sessionData.amount_total / 100,
				shippingAddress: sessionData.metadata,
			});
			//
			if (order) {
				const bulkOptions = cart.cartItems.map((ele) => ({
					updateOne: {
						filter: { _id: ele.product, stock: { $gte: ele.quantity } },
						update: { $inc: { stock: -ele.quantity, sold: ele.quantity } },
					},
				}));
				const result = await Product.bulkWrite(bulkOptions);
				if (result.modifiedCount < cart.cartItems.length) {
					const failedItems = cart.cartItems.filter(
						(_, index) => !result.modifiedCount[index]
					);

					return res.status(StatusCodes.BAD_REQUEST).json({
						message: 'Some items in your cart are out of stock',
						failedItems: failedItems,
					});
				}

				await cart.deleteOne();
			} else {
				return next(new Forbidden(`Unhandled event type ${event.type}`));
			}

			response.json({ data: event, message: 'done' });
		}
	}
);

app.use(express.static('./uploads'));

bootstrap(app);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
