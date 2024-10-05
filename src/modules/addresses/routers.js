import express from 'express';
import { validateResource } from '../../utils/middlewares.js';
const router = express.Router();
import {
	addAddress,
	updateAddress,
	getLoggedInUserAddresses,
	removeAddress,
} from './controllers.js';
import { addAddressSchema, updateAddressSchema } from './validation.js';

router
	.route('/')
	.get(getLoggedInUserAddresses)
	.post(validateResource(addAddressSchema), addAddress);

router
	.route('/:addressId')
	.delete(removeAddress)
	.patch(validateResource(updateAddressSchema), updateAddress);

export default router;
