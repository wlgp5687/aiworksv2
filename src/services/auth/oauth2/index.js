import uuidv4 from 'uuid/v4';
import * as memberComponent from '../../../components/member/member';
import { nowDateTime } from '../../../components/common';
import { sequelize } from '../../../database';
import * as kakao from './kakao';
import * as naver from './naver';
import { throwError } from '../..';

const getAuthService = (joinType) => {
	let authService;
	switch (joinType) {
		case 'KAKAO':
			authService = kakao;
			break;
		case 'NAVER':
			authService = naver;
			break;
		default:
			break;
	}

	if (!authService) throwError(`Not available join type ${joinType}`, 400);
	return authService;
};

export const getSnsLoginInfo = (joinType) => {
	const authService = getAuthService(joinType);
	const csrfState = uuidv4();
	const loginUrl = authService.getSnsLoginUrl(csrfState);
	return { csrfState, loginUrl };
};

export const getMemberByOauth = async (joinType, code) => {
	const authService = getAuthService(joinType);
	const accessToken = await authService.getAccessToken(code);
	const snsMemberData = await authService.getSnsMemberInfo(accessToken);

	let memberExternal = await memberComponent.getMemberExternalByJoinTypeCodeAndToken(joinType, snsMemberData.sns_id);
	if (!memberExternal) {
		if (!(snsMemberData.name && snsMemberData.phone)) {
			throwError('입력 값이 부족합니다.', 400);
		}
		let member = await memberComponent.getMemberByNameAndPhone(snsMemberData.name, snsMemberData.phone);

		snsMemberData.last_login_at = await nowDateTime();
		memberExternal = await sequelize.transaction(async (t) => {
			if (!member) {
				snsMemberData.register_type = 'sns';
				member = await memberComponent.addMember(snsMemberData, false, t);
				await memberComponent.addMemberInfo(member.dataValues.id, snsMemberData, t);
			}

			const external = await memberComponent.addMemberExternal(member.dataValues.id, joinType, snsMemberData.sns_id, t);
			return external;
		});
	}

	const member = memberComponent.getMemberById(memberExternal.dataValues.member_id);
	return member;
};
