import { Router } from 'express';
import { errorHandler, validateData } from '@libs/middlewares';
import {
	createProduct,
	deleteProduct,
	getProducts,
	updateProduct,
} from '../controllers/product.controller';
import {
	ProductCreationSchema,
	ProductUpdateSchema,
} from '../schema/product.schema';
import { getUpsellProducts } from '../controllers/upsell.controller';

const router = Router();

router.get('/list', errorHandler(getProducts));
router.get('/list/upsell', errorHandler(getUpsellProducts));

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

export default router;
