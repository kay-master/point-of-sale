import { ERROR_CODE, SessionToken } from '@libs/interfaces';
import { NotFoundException, UnauthorizedException } from '@libs/middlewares';
import * as jwt from 'jsonwebtoken';

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
	const secret = process.env.TOKEN_SECRET;

	if (!secret) {
		throw new NotFoundException('Token secret not found!', null);
	}

	if (!token) {
		throw new UnauthorizedException(null);
	}

	try {
		return jwt.verify(token, secret) as SessionToken;
	} catch (error) {
		console.error('verifyToken:', error);

		throw new UnauthorizedException({
			error: 'Invalid/Expired token',
			code: ERROR_CODE.INVALID_TOKEN,
		});
	}
};
