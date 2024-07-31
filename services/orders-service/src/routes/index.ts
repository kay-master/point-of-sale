import { errorHandler, validateData } from '@libs/middlewares';
import { Request, Response, Router } from 'express';
import { createOrder } from '../controllers/order.controller';
import { OrderCreationSchema } from '../schema/order.schema';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
	res.send('Service is up and running!');
});

router.post('/', validateData(OrderCreationSchema), errorHandler(createOrder));

export default router;
