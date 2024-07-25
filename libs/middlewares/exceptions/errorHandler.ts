import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { InternalException } from "./internal-exception";
import { HttpException } from "./root";
import { UnprocessableEntity } from "./validation";
import { errorResponse } from "../httpResponse";

export const errorHandler = (method: Function) => {
	return async (req: any, res: any, next: any) => {
		try {
			await method(req, res, next);
		} catch (error: any) {
			let exception: HttpException;

			console.group("Error Handler");
			console.error(error.stack ? error.stack : error);
			console.groupEnd();

			if (error instanceof HttpException) {
				exception = error;
			} else if (error instanceof ZodError) {
				exception = new UnprocessableEntity(
					"Invalid request data. Please review your request and try again",
					error.errors,
				);
			} else {
				exception = new InternalException("Something went wrong!", null);
			}

			next(exception);
		}
	};
};

export const errorMiddleware = (
	error: HttpException,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const status = error.statusCode || 500;
	const message = error.message || "Something went wrong";
	const errors = error.errors || null;

	res.status(status).json(errorResponse(message, errors));
};
