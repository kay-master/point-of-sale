import { NotFoundException } from './../exceptions/not-found';
import { UnauthorizedException } from './../exceptions/validation';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { SessionToken } from '@libs/interfaces';

/**
 * Inter-service authentication middleware.
 * Using `SERVICE_COMMUNICATION_TOKEN` to verify the request is from a trusted service.
 * Extracts user information from the request headers
 */
export const authMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	// Extract bearer token from the request headers
	const token = (req.headers['service-token'] as string | undefined)?.split(
		' '
	)[1];

	const SERVICE_COMMUNICATION_TOKEN =
		process.env.SERVICE_COMMUNICATION_TOKEN || '';

	if (!SERVICE_COMMUNICATION_TOKEN) {
		throw new NotFoundException(
			'Service communication token not found!',
			null
		);
	}

	try {
		// Verify the token
		if (!token || token !== SERVICE_COMMUNICATION_TOKEN) {
			return next(new UnauthorizedException('Unauthorized access', null));
		}

		next();
	} catch (error) {
		console.error('authMiddleware:', error);

		next(new UnauthorizedException('Unauthorized access', null));
	}
};

export const signToken = (data: SessionToken, expiresIn = '10d') => {
	const secret = process.env.TOKEN_SECRET;

	if (!secret) {
		throw new NotFoundException('Token secret not found!', null);
	}

	return jwt.sign(data, secret, {
		expiresIn,
	});
};

export const verifyToken = (token: string) => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new NotFoundException('Token secret not found!', null);
	}

	if (!token) {
		throw new UnauthorizedException('Unauthorized access', null);
	}

	try {
		return jwt.verify(token, secret) as SessionToken;
	} catch (error) {
		console.error('verifyToken:', error);

		throw new UnauthorizedException('Unauthorized access!', {
			error: 'Invalid/Expired token',
		});
	}
};

export const extractUser = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const userId = req.headers['x-account-id'];

	if (!userId) {
		next(new UnauthorizedException('Unauthorized access', null));
	}

	// @ts-ignore
	req.user = {
		accountId: parseInt(userId as string),
	};

	return next();
};

export const routeMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.url.includes('/internal')) {
		return authMiddleware(req, res, next);
	}

	extractUser(req, res, next);
};
