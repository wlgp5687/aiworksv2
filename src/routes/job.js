import express from 'express';
import { wrapAsyncRouter } from '../services';

import * as jobController from '../controllers/job';
// import * as adminValidator from '../../validators/admin/admin';

const router = express.Router();

// 작업 완료
router.post(
	'/',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await jobController.postJob(req);
		return res.json(response);
	}),
);

// 작업 목록 조회
router.get(
	'/',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await jobController.getJobList(req);
		return res.json(response);
	}),
);

// 작업 상세 조회
router.get(
	'/:job_id',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await jobController.getJobDetail(req);
		return res.json(response);
	}),
);

export default router;
