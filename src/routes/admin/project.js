import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as projectController from '../../controllers/admin/project';

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

// 프로젝트 설정 수정
router.patch(
	'/:project_id',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.patchProject(req);
		return res.json(response);
	}),
);

// 프로젝트 상세 조회
router.get(
	'/:project_id',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.getProjectDetail(req);
		return res.json(response);
	}),
);

// 프로젝트 목록 조회
router.get(
	'/',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.getProjectList(req);
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

// 프로젝트 삭제
router.delete(
	'/:project_id',
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.deleteProject(req);
		return res.json(response);
	}),
);

// 프로젝트 참여자 등록
router.post(
	'/members',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.postProjectMembers(req);
		return res.json(response);
	}),
);

// 프로젝트 참여자 조회
router.get(
	'/:project_id/members',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.getProjectMemberList(req);
		return res.json(response);
	}),
);

// 프로젝트 참여자 수정
router.patch(
	'/:project_id/members/:member_id',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.patchProjectMember(req);
		return res.json(response);
	}),
);

// 프로젝트 참여자 삭제
router.delete(
	'/:project_id/members/:member_id',
	// ...adminValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await projectController.deleteProjectMember(req);
		return res.json(response);
	}),
);

export default router;
