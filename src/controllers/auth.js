import * as oauth2Service from '../services/auth/oauth2/index';
import * as memberService from '../services/member/member';
import * as jwtService from '../services/auth/jwt';
import * as redisService from '../services/redis';
import { throwError } from '../services';

export const getSnsLoginUrl = (req) => {
	const joinType = req.params.joinType.toUpperCase();
	const { csrfState, loginUrl } = oauth2Service.getSnsLoginInfo(joinType);
	redisService.redisSetKeyValue(String(csrfState), { csrf_state: csrfState });
	return loginUrl;
};

export const snsLogin = async (req) => {
	const loginIp = req.body.login_ip ? req.body.login_ip : req.ipAddress;
	const joinType = req.params.joinType.toUpperCase();
	const { code, state } = req.body;

	const csrfState = await redisService.redisGetValue(String(state));

	if (csrfState.csrf_state !== state) {
		throwError('Invalid state', 422);
	}

	await redisService.redisDelKey(String(state));

	const member = await oauth2Service.getMemberByOauth(joinType, code, state);
	const memberLoginData = await memberService.doSnsLogin(member, loginIp);
	const token = await jwtService.refreshToken(req.csrfToken(), req.encodedToken, memberLoginData, false, true);
	return { token };
};
