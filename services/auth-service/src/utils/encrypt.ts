import { ERROR_CODE, SessionToken } from '@libs/interfaces';
import { NotFoundException, getTokenKey } from '@libs/middlewares';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../db/models/user.model';

export const signToken = (data: SessionToken, expiresIn = '10d') => {
	const secret = getTokenKey(__dirname + '/../', 'private');

	if (!secret) {
		throw new NotFoundException('Token secret not found!', null);
	}

	return jwt.sign(data, secret, {
		algorithm: 'RS256',
		expiresIn,
	});
};

export const validateToken = async (req: Request) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return {
			error: 'Token not found',
			code: ERROR_CODE.INVALID_TOKEN,
		};
	}

	const secret = getTokenKey(__dirname + '/../', 'public');

	if (!secret) {
		console.error('validateToken: Token secret not found!');

		return {
			error: 'Token not found!',
			code: ERROR_CODE.INVALID_TOKEN,
		};
	}

	try {
		const decoded = jwt.verify(token, secret, {
			algorithms: ['RS256'],
		}) as SessionToken;

		// Check if user is still in the database
		const checkUser = await User.findByPk(decoded.accountId);

		if (!checkUser) {
			return {
				error: 'Account not found',
				code: ERROR_CODE.INVALID_TOKEN,
			};
		}

		return {
			decoded,
		};
	} catch (error) {
		console.error('validateToken:', error);
		let errorObj = error;

		if (error instanceof (jwt.TokenExpiredError || jwt.JsonWebTokenError)) {
			errorObj = {
				error: 'Invalid/Expired token',
				code: ERROR_CODE.INVALID_TOKEN,
			};
		}

		return {
			error: errorObj,
			code: ERROR_CODE.INVALID_TOKEN,
		};
	}
};
