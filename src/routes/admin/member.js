import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as memberController from '../../controllers/admin/member';

const router = express.Router();

// 일반회원 목록 조회
router.get(
	'/',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.getMembers(req);
		return res.json(response);
	}),
);

// 일반회원 상세 조회
router.get(
	'/:member_id',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.getMember(req);
		return res.json(response);
	}),
);

// 일반회원 상세 수정
router.patch(
	'/:member_id',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.patchMember(req);
		return res.json(response);
	}),
);

// 일반회원 로그인 이력조회
router.get(
	'/:member_id/loginlog',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.getMemberLoginLog(req);
		return res.json(response);
	}),
);

// 일반회원 프로젝트 이력조회
router.get(
	'/:member_id/project',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.getMemberProjectLog(req);
		return res.json(response);
	}),
);

export default router;
