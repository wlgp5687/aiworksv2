import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as enterpriseController from '../../controllers/admin/enterprise';

const router = express.Router();

// 기업회원 목록 조회
router.get(
	'/',
	wrapAsyncRouter(async (req, res) => {
		const response = await enterpriseController.getEnterprises(req);
		return res.json(response);
	}),
);

// 기업회원 상세 조회
router.get(
	'/:enterprise_id',
	wrapAsyncRouter(async (req, res) => {
		const response = await enterpriseController.getEnterprise(req);
		return res.json(response);
	}),
);

// 기업회원 상세 수정
router.patch(
	'/:enterprise_id',
	wrapAsyncRouter(async (req, res) => {
		const response = await enterpriseController.patchEnterprise(req);
		return res.json(response);
	}),
);

export default router;
