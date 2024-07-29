import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { errorHandler, validateData } from '@libs/middlewares';
import { LoginSchema, RegisterSchema } from '../schema/auth.schema';

const router = Router();

// Health check endpoint
router.get('/', (_req, res) => {
	res.send('Auth Service is up and running!');
});

router.post('/register', validateData(RegisterSchema), errorHandler(register));
router.post('/login', validateData(LoginSchema), errorHandler(login));

export default router;
