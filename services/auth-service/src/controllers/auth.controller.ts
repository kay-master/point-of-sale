import { Request, Response } from 'express';
import { loginService, registerService } from '../services/auth.service';
import { HTTP_STATUS_CODES, successResponse } from '@libs/middlewares';

export const register = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await registerService(req.body),
			'User registered successfully'
		)
	);
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await loginService({ email, password }),
			'User logged in successfully'
		)
	);
};
