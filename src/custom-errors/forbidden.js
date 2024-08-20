import { StatusCodes } from 'http-status-codes';
import CustomError from './custom-error.js';

class Forbidden extends CustomError {
	constructor(message) {
		super(message, StatusCodes.FORBIDDEN);
	}
}

export default Forbidden;
