import UserRouter from '../modules/users/routers.js';
import CategoryRouter from '../modules/categories/routers.js';
import SupCategoryRouter from '../modules/supCategories/routers.js';
import BrandRouter from '../modules/brands/routers.js';
import ProductRouter from '../modules/products/routers.js';

import AuthRouter from '../modules/auth/routers.js';
import { isAuthenticated } from '../modules/auth/middlewares.js';
import express from 'express';

const bootstrap = async (app) => {
	app.use(express.json());
	app.use('/auth', AuthRouter);

	app.use(isAuthenticated);

	app.use('/api/v1/users', UserRouter);
	app.use('/api/v1/categories', CategoryRouter);
	app.use('/api/v1/sub-categories', SupCategoryRouter);
	app.use('/api/v1/brands', BrandRouter);
	app.use('/api/v1/products', ProductRouter);

	app.use('*', (req, res) => res.json('Page Not Found'));
};

export default bootstrap;
