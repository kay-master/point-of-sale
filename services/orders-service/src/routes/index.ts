import { errorHandler, validateData } from '@libs/middlewares';
import { Request, Response, Router } from 'express';
import {
	createOrder,
	getOrderDetails,
	getOrders,
} from '../controllers/order.controller';
import { OrderCreationSchema } from '../schema/order.schema';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
	res.send('Service is up and running!');
});

router.get('/', errorHandler(getOrders));
router.get('/:orderId', errorHandler(getOrderDetails));
router.post('/', validateData(OrderCreationSchema), errorHandler(createOrder));

export default router;
