import { UnprocessableEntity } from "./../exceptions/validation";

import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z } from "zod";
import { errorHandler } from "../exceptions";

export const resourceId = (req: Request, res: Response, next: NextFunction) => {
	errorHandler(() => {
		z.number({
			message: "Invalid resource ID",
		})
			.positive()
			.parse(Number(req.params.id));
	})(req, res, next);

	next();
};

export function validateData(schema: AnyZodObject) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const results = schema.safeParse(req.body);

		if (!results.success) {
			return next(
				new UnprocessableEntity(
					"Invalid request data. Please review your request and try again",
					results.error,
				),
			);
		}

		req.body = results.data;
		next();
	};
}
