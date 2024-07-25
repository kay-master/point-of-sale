import { Request, Response } from 'express';

/**
 * Ping controller 
 */
export const pingController = async (_req: Request, res: Response) => {
	try {
		return res.status(200).send('Ok');
	} catch (error) {
		return res.status(500).send(error);
	}
};
