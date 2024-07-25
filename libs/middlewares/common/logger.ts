import { Request, Response } from "express";
import morgan, { Options } from "morgan";

export function logger(format?: string, options?: Options<Request, Response>) {
	const createFormat =
		format ||
		':remote-addr - [:date[clf]] ":method :url" :status ":referrer" ":user-agent"';

	return morgan(createFormat, options);
}
