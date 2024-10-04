import UserRouter from '../modules/users/routers.js';
import CategoryRouter from '../modules/categories/routers.js';
import SupCategoryRouter from '../modules/supCategories/routers.js';
import BrandRouter from '../modules/brands/routers.js';
import ProductRouter from '../modules/products/routers.js';
import ReviewRouter from '../modules/reviews/routers.js';
import WishlistRouter from '../modules/wishlist/routers.js';
import AddressesRouter from '../modules/addresses/routers.js';

import AuthRouter from '../modules/auth/routers.js';
import { isAuthenticated } from '../modules/auth/middlewares.js';
import express from 'express';
import ErrorHandler from '../errors/middleware.js';

const bootstrap = async (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use('/auth', AuthRouter);

	app.use(isAuthenticated);

	app.use('/api/v1/users', UserRouter);
	app.use('/api/v1/categories', CategoryRouter);
	app.use('/api/v1/sub-categories', SupCategoryRouter);
	app.use('/api/v1/brands', BrandRouter);
	app.use('/api/v1/reviews', ReviewRouter);
	app.use('/api/v1/wishlist', WishlistRouter);
	app.use('/api/v1/addresses', AddressesRouter);
	app.use('/api/v1/products', ProductRouter);
	app.use(ErrorHandler);
	app.use('*', (req, res) => res.json('Page Not Found'));
};

export default bootstrap;
