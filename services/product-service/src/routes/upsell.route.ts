import { Router } from 'express';
import { errorHandler, validateData } from '@libs/middlewares';
import {
	createUpsellProduct,
	removeUpsellProduct,
} from '../controllers/upsell.controller';
import { UpsellCreationSchema } from '../schema/upsell.schema';

const router = Router();

router.post(
	'/',
	validateData(UpsellCreationSchema),
	errorHandler(createUpsellProduct)
);

router.delete('/:upsellId', errorHandler(removeUpsellProduct));

export default router;
