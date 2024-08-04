import { validateToken } from './../utils/encrypt';
import { Request, Response } from 'express';
import { loginService, registerService } from '../services/auth.service';
import {
	HTTP_STATUS_CODES,
	UnauthorizedException,
	successResponse,
} from '@libs/middlewares';

export const register = async (req: Request, res: Response) => {
	res.status(HTTP_STATUS_CODES.CREATED).json(
		successResponse(
			await registerService(req.body),
			'Registered successfully'
		)
	);
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(
			await loginService({ email, password }),
			'Logged in successfully'
		)
	);
};

export const verifyToken = async (req: Request, res: Response) => {
	const results = await validateToken(req);

	if (results.error) {
		throw new UnauthorizedException(results);
	}

	res.status(HTTP_STATUS_CODES.OK).json(
		successResponse(results.decoded, 'Token is valid')
	);
};
