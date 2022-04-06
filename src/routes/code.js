import express from 'express';
import { wrapAsyncRouter } from '../services';
import * as codeController from '../controllers/code.js';

const router = express.Router();

// 코드type으로 코드조회
router.post(
	'/type',
	wrapAsyncRouter(async (req, res) => {
		const response = await codeController.getCodesByType(req);
		return res.json(response);
	}),
);

// 코드 등록
router.post(
	'/',
	wrapAsyncRouter(async (req, res) => {
		const response = await codeController.postCode(req);
		return res.json(response);
	}),
);

export default router;
