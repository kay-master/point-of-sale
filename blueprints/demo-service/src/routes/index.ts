import { Request, Response, Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { errorHandler, validateData } from '@libs/middlewares';
import { LoginSchema, RegisterSchema } from '../schema/auth.schema';

const router = Router();

// Health check endpoint
router.get(
	'/',
	errorHandler((_req: Request, res: Response) => {
		res.send('Service is up and running!');
	})
);

export default router;
