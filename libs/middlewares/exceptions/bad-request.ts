import { HTTP_STATUS_CODES, HttpException } from './root';

export class BadRequestException extends HttpException {
	constructor(message: string, errors: any) {
		super(message, null, HTTP_STATUS_CODES.BAD_REQUEST, errors);
	}
}
