import express from 'express';
import { wrapAsyncRouter } from '../../services';

import * as adminController from '../../controllers/admin/admin';
// import * as adminValidator from '../../validators/admin/admin';

const router = express.Router();

// 관리자 회원 로그인
router.post(
	'/login',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await adminController.login(req);
		return res.json(response);
	}),
);

// 관리자 회원 등록
router.post(
	'/register',
	wrapAsyncRouter(async (req, res) => {
		const response = await adminController.register(req);
		return res.json(response);
	}),
);

export default router;
