import express from 'express';
import { wrapAsyncRouter } from '../services';

import * as projectController from '../controllers/project';
// import * as adminValidator from '../../validators/admin/admin';

const router = express.Router();

// 프로젝트 생성
router.post(
	'/',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.createProject(req);
		return res.json(response);
	}),
);

// 프로젝트 설정 저장
router.patch(
	'/:project_id',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.patchProject(req);
		return res.json(response);
	}),
);

// 프로젝트 형식 저장 (임시)
router.post(
	'/config',
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.postProjectConfig(req);
		return res.json(response);
	}),
);

// 프로젝트 형식 조회
router.get(
	'/:project_id/config',
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.getProjectConfig(req);
		return res.json(response);
	}),
);

// 프로젝트 형식 수정
router.patch(
	'/:project_id/config',
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.patchProjectConfig(req);
		return res.json(response);
	}),
);

export default router;
