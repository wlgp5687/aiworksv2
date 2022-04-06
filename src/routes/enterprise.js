import express from 'express';
import * as enterpriseController from '../controllers/enterprise';
import { wrapAsyncRouter } from '../services';

const router = express.Router();

router.post(
	'/register',
	wrapAsyncRouter(async (req, res) => {
		const response = await enterpriseController.register(req);
		return res.json(response);
	}),
);

router.post(
	'/login',
	wrapAsyncRouter(async (req, res) => {
		const refreshToken = await enterpriseController.login(req);
		return res.status(200).json(refreshToken);
	}),
);

router.get(
	'/me',
	wrapAsyncRouter(async (req, res) => {
		const enterprise = await enterpriseController.getEnterpriseByToken(req);
		return res.status(200).json(enterprise);
	})

)

router.put(
	'/me',
	wrapAsyncRouter(async (req, res) => {
		const enterprise = await enterpriseController.updateEnterpriseByToken(req);
		return res.status(200).json(enterprise)
	})
)

export default router;
