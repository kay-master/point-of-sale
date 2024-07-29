import { HTTP_STATUS_CODES, HttpException } from "./root";

export class UnprocessableEntity extends HttpException {
	constructor(message: string, errors: any) {
		super(
			message || "Unprocessable entity",
			null,
			HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
			errors,
		);
	}
}

export class UnauthorizedException extends HttpException {
	constructor(errors?: any, message?: string) {
		super(
			message || "Unauthorized access",
			null,
			HTTP_STATUS_CODES.UNAUTHORIZED,
			errors,
		);
	}
}
