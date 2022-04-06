import express from 'express';
import * as memberService from '../services/member/member';
import * as jwtService from '../services/auth/jwt';
import * as oauth2Service from '../services/auth/oauth2/index';

const router = express.Router();

// JWT 토큰 발급
export const getToken = async (req) => {
	// 기존 Token 이 존재하는 경우 token 획득
	const token = jwtService.getJwtToken(req);
	const csrf = req.csrfToken();

	// 토큰 생성
	const response = await jwtService.generateToken(token, csrf);
	return response;
};

// JWT 토큰 갱신
export const refreshToken = async (req) => {
	// 기존 Token 이 존재하는 경우 token 획득
	const token = jwtService.getJwtToken(req);
	const csrf = req.csrfToken();

	// 토큰 갱신
	const refreshedtoken = await jwtService.refreshToken(csrf, token);
	const decodedToken = await jwtService.decodeToken(refreshedtoken);
	return { refreshedtoken, decoded_token: decodedToken };
};

// JWT 토큰 체크
export const checkToken = async (req) => {
	// 기존 Token 이 존재하는 경우 token 획득
	const token = jwtService.getJwtToken(req);
	const decodedToken = await jwtService.decodeToken(token);

	return { token, decoded_token: decodedToken };
};

export const snsLogin = async (joinType, req) => {
	const loginIp = req.body.login_ip ? req.body.login_ip : req.ipAddress;

	const member = await oauth2Service.getMemberByOauth(joinType, req);
	const memberLoginData = await memberService.doSnsLogin(member, loginIp);
	const token = await jwtService.refreshToken(req.csrfToken(), req.encodedToken, memberLoginData, false, true);
	return token;
};

export default router;
