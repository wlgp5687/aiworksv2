import express from 'express';
import { wrapAsyncRouter } from '../services';
import * as authController from '../controllers/auth';

const router = express.Router();

router.get(
	'/:joinType',
	wrapAsyncRouter(async (req, res) => {
		const loginUrl = authController.getSnsLoginUrl(req);
		return res.status(200).json({ login_url: loginUrl });
	}),
);

router.post(
	'/:joinType/callback',
	wrapAsyncRouter(async (req, res) => {
		const { token } = await authController.snsLogin(req);
		res.status(200).json({ token });
	}),
);

export default router;
