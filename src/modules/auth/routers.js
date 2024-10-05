import express from 'express';

const router = express.Router();
import { register, login, forgetPassword } from './controllers.js';
import { validateResource } from '../../utils/middlewares.js';
import {
	registerValidation,
	forgetPasswordValidation,
	loginValidation,
} from './validation.js';

router.post('/register/', validateResource(registerValidation), register);

router.post('/login/', validateResource(loginValidation), login);

router.post(
	'/forget-password/',
	validateResource(forgetPasswordValidation),
	forgetPassword
);

export default router;
