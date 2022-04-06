import express from 'express';
import { wrapAsyncRouter } from '../services';
import { sequelize } from '../database';
import { decodeToken } from '../services/auth/jwt';

import admin from './admin/router';
import enterprise from './enterprise';
import member from './member';
import project from './project';
import job from './job';
import auth from './auth';
import oauth2 from './oauth2';
import cert from './cert';
import code from './code';
import file from './file';

const router = express.Router();

router.get(
	'/status',
	wrapAsyncRouter(async (req, res) => {
		await sequelize.authenticate();
		return res.send('OK');
	}),
);

// Request Ip Reform
router.use('*', (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	req.ipAddress = ip;
	next();
});

router.use('/auth', auth);

// JWT 인증
router.use('*', async (req, res, next) => {
	const token = req.headers['x-access-token'] || req.query.token || req.cookies.token;
	req.encodedToken = token;
	try {
		req.decodedToken = await decodeToken(!token ? null : token);
		return next();
	} catch (err) {
		return next(err);
	}
});

// 관리자
router.use('/admins', admin);

// 기업회원
router.use('/enterprises', enterprise);

// 회원
router.use('/members', member);

// SNS 로그인
router.use('/oauth2', oauth2);

// 본인인증
router.use('/cert', cert);

// 프로젝트
router.use('/projects', project);

// 작업
router.use('/jobs', job);

// 공통코드
router.use('/codes', code);

// 파일
router.use('/files', file);

export default router;
