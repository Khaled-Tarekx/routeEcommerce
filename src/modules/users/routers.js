import express from 'express';
import { validateResource } from '../../utils/middlewares.js';

const router = express.Router();
import {
	getUserByID,
	getUsers,
	updateUser,
	deleteUser,
	getMyUser,
	updatePassword,
} from './controllers.js';
import { updatePasswordSchema, updateUserSchema } from './validation.js';

router.route('/').get(getUsers);
router.get('/me', getMyUser);

router.patch('/update-user', validateResource(updateUserSchema), updateUser);

router.patch(
	'/update-password',
	validateResource(updatePasswordSchema),
	updatePassword
);
router.delete('/delete-user', deleteUser);

router.get('/:id', getUserByID);

export default router;
