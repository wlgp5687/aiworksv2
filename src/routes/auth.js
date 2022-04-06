import express from 'express';
import { wrapAsyncRouter } from '../services';
import * as jwtController from '../controllers/jwt';

const router = express.Router();

// JWT 토큰 발급
router.get(
	'/jwt/token',
	wrapAsyncRouter(async (req, res) => {
		const response = await jwtController.getToken(req);
		return res.json(response);
	}),
);

// JWT 토큰 갱신
router.get(
	'/jwt/refresh-token',
	wrapAsyncRouter(async (req, res) => {
		const response = await jwtController.refreshToken(req);
		return res.json(response);
	}),
);

// JWT 토큰 체크
router.get(
	'/jwt/check-token',
	wrapAsyncRouter(async (req, res) => {
		const response = await jwtController.checkToken(req);
		return res.json(response);
	}),
);

export default router;
