import express from 'express';

const router = express.Router();
import {register, login, forgetPassword} from './controllers.js';
import {checkEmailAndHash, validateResource} from './middlewares.js';
import {
    registerValidation,
    forgetPasswordValidation,
    loginValidation,
} from './validation.js';

router.post(
    '/register/',
    checkEmailAndHash,
    validateResource(registerValidation),
    register
);

router.post('/login/', validateResource(loginValidation), login);

router.post(
    '/forget-password/',
    validateResource(forgetPasswordValidation),
    forgetPassword
);

export default router;
