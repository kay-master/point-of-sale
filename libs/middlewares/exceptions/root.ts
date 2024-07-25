export class HttpException extends Error {
	message: string;
	errorCode: number;
	statusCode: number;
	errors: any;

	constructor(
		message: string,
		errorCode: any,
		statusCode: number,
		errors: any,
	) {
		super(message);
		this.message = message;
		this.errorCode = errorCode;
		this.statusCode = statusCode;
		this.errors = errors;
	}
}

export enum HTTP_STATUS_CODES {
	OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	NO_CONTENT = 204,
	MOVED_PERMANENTLY = 301,
	NOT_FOUND = 404,
	UNAUTHORIZED = 401,
	BAD_REQUEST = 400,
	INTERNAL_SERVER_ERROR = 500,
	FORBIDDEN = 403,
	UNPROCESSABLE_ENTITY = 422,
}
