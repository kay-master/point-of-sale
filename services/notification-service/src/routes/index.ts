import { Request, Response, Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
	res.send('Service is up and running!');
});

export default router;
