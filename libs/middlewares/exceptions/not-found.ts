import { HTTP_STATUS_CODES, HttpException } from './root';

export class NotFoundException extends HttpException {
	constructor(message: string, errors: any) {
		super(message, null, HTTP_STATUS_CODES.NOT_FOUND, errors);
	}
}
