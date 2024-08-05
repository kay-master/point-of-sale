import { errorHandler, routeMiddleware, validateData } from '@libs/middlewares';
import { Request, Response, Router } from 'express';
import {
	createOrder,
	getOrderDetails,
	getOrders,
	updateOrderStatus,
} from '../controllers/order.controller';
import { OrderCreationSchema, OrderUpdateSchema } from '../schema/order.schema';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
	res.send('Service is up and running!');
});

router.use(routeMiddleware(__dirname + '/../'));

router.get('/', errorHandler(getOrders));
router.get('/:orderId', errorHandler(getOrderDetails));
router.post('/', validateData(OrderCreationSchema), errorHandler(createOrder));

router.put(
	'/:orderId/status',
	validateData(OrderUpdateSchema),
	errorHandler(updateOrderStatus)
);

export default router;
