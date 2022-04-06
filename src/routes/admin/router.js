import express from 'express';
import admin from './admin';
import board from './board';
import member from './member';
import enterprise from './enterprise';
import project from './project';
import job from './job';

import { throwError } from '../../services';

const router = express.Router();

// 관리자 회원 인증
router.use('*', async function (req, res, next) {
	const { baseUrl } = req;
	if (baseUrl === '/admins/admins/login') {
		return next();
	}
	try {
		const adminId = req.decodedToken.data.admin ? req.decodedToken.data.admin.id : null;
		if (!adminId) throwError("Invalid admin member 'id' ", 500);
		return next();
	} catch (err) {
		return next(err);
	}
});

// 관리자
router.use('/admins', admin);

// 일반회원
router.use('/members', member);

// 기업회원
router.use('/enterprises', enterprise);

// 게시판
router.use('/boards', board);

// 프로젝트
router.use('/projects', project);

// 작업
router.use('/jobs', job);

export default router;
