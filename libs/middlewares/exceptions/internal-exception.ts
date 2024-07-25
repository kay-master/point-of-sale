import { HTTP_STATUS_CODES, HttpException } from "./root";

export class InternalException extends HttpException {
	constructor(message: string, errors: any) {
		super(message, null, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, errors);
	}
}
