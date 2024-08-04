import { Router } from 'express';
import { login, register, verifyToken } from '../controllers/auth.controller';
import { errorHandler, validateData } from '@libs/middlewares';
import { LoginSchema, RegisterSchema } from '../schema/auth.schema';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
	res.send('Service is up and running!');
});

router.post('/register', validateData(RegisterSchema), errorHandler(register));
router.post('/login', validateData(LoginSchema), errorHandler(login));
router.get('/verify-token', errorHandler(verifyToken));

export default router;
