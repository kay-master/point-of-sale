import { Request, Response, Router } from 'express';
import productRoute from './product.route';
import upsellRoute from './upsell.route';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
	res.send('Service is up and running!');
});

router.use('/', productRoute);
router.use('/upsell', upsellRoute);

export default router;
