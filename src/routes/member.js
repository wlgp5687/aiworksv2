import express from 'express';
import { wrapAsyncRouter } from '../services';
import * as memberController from '../controllers/member';

const router = express.Router();

router.get(
	'/',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.getMembers(req);
		return res.status(200).json(response);
	}),
);

// 내 정보
router.get(
	'/me',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.getMemberByToken(req);
		return res.status(200).json(response);
	}),
);

// 내정보 수정
router.put(
	'/me',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.updateMemberByToken(req);
		return res.status(200).json(response);
	}),
);

router.delete(
	'/me',
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.withdrawalByToken(req);
		return res.status(200).json(response);
	}),
);

// 회원 가입
router.post(
	'/register',
	// ...memberValidator.postLogin,
	wrapAsyncRouter(async (req, res) => {
		const response = await memberController.register(req);
		return res.status(201).json(response);
	}),
);

router.post(
	'/login',
	wrapAsyncRouter(async (req, res) => {
		const refreshToken = await memberController.login(req);
		return res.status(200).json(refreshToken);
	}),
);

export default router;
