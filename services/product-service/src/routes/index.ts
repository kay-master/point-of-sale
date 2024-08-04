import { Request, Response, Router } from 'express';
import { errorHandler, routeMiddleware, validateData } from '@libs/middlewares';
import {
	createProduct,
	deleteProduct,
	getProducts,
	updateProduct,
} from '../controllers/product.controller';
import {
	createUpsellProduct,
	getUpsellProducts,
	removeUpsellProduct,
} from '../controllers/upsell.controller';
import {
	ProductCreationSchema,
	ProductUpdateSchema,
} from '../schema/product.schema';
import { UpsellCreationSchema } from '../schema/upsell.schema';

const router = Router();

// Health checking endpoint
router.get('/health', (_req: Request, res: Response) => {
	res.send('Service is up and running!');
});

router.get('/list', errorHandler(getProducts));

// Upsell routes
router.get('/list/upsell', errorHandler(getUpsellProducts));

// Middleware to authenticate  below routes
router.use(routeMiddleware(__dirname + '/../'));

router.post(
	'/',
	validateData(ProductCreationSchema),
	errorHandler(createProduct)
);
router.put(
	'/:id',
	validateData(ProductUpdateSchema),
	errorHandler(updateProduct)
);
router.delete('/:id', errorHandler(deleteProduct));

router.post(
	'/upsell',
	validateData(UpsellCreationSchema),
	errorHandler(createUpsellProduct)
);

router.delete('/upsell/:upsellId', errorHandler(removeUpsellProduct));

export default router;
