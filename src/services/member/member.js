import bcrypt from 'bcryptjs';
import * as memberComponent from '../../components/member/member';
import * as commonComponent from '../../components/common';
import { sequelize } from '../../database';
import { throwError } from '../index';

const generateReferralCode = () => {
	const code = commonComponent.generateRandomString(10);
	return code;
};

const updateMemberLoginSuccessLog = async (memberId, loginIp, nowDate) => {
	const response = await sequelize.transaction(async (t) => {
		await memberComponent.updateMemberLogin(memberId, nowDate, t);
		await memberComponent.addMemberLoginLog(memberId, loginIp, t);
		await memberComponent.increaseMemberStatisticLoginCount(memberId, t);
		return memberId;
	});
	return response;
};

export const doSnsLogin = async (member, loginIp) => {
	const nowDate = await commonComponent.nowDateTime();
	if (member.dataValues.is_deleted === 'Y' || member.dataValues.is_out === 'Y') throwError('회원 정보를 찾을 수 없습니다.', 401);
	if (member.dataValues.is_blocked === 'Y') throwError('블락된 회원입니다.', 403);
	await updateMemberLoginSuccessLog(member.dataValues.id, loginIp, nowDate);

	return { member: { id: member.dataValues.id } };
};

export const verifyMember = async (loginId, password, nowDate) => {
	const member = await memberComponent.getMemberByLoginId(loginId);
	if (!member) throwError('Invalid values', 400);

	// TODO 로그인 실패 카운트로 로그인 제한을 두는 실패 횟수, 제한 시간에 대한 기획 및 설정값 관리 방법 필요
	// 일단 하드코딩으로 구현
	if (member.dataValues.login_fail_cnt >= 5) {
		const now = new Date(nowDate);
		const lastLoginFailure = new Date(member.dataValues.login_fail_date);

		const diffMins = Math.floor((now - lastLoginFailure) / 60000);
		if (diffMins < 15) {
			throwError('실패횟수 초과로 15분간 로그인 할 수 없습니다.', 403);
		}
	}

	if (!bcrypt.compareSync(password, member.dataValues.password)) {
		await memberComponent.increaseLoginFailureCount(member.dataValues.id, nowDate);
		throwError('회원정보가 일치하지 않습니다.', 401);
	}

	if (member.dataValues.is_deleted === 'Y' || member.dataValues.is_out === 'Y') throwError('회원 정보를 찾을 수 없습니다.', 401);
	if (member.dataValues.is_blocked === 'Y') throwError('블락된 회원입니다.', 403);

	return member;
};

export const doLogin = async (loginId, password, loginIp) => {
	const nowDate = await commonComponent.nowDateTime();
	const member = await verifyMember(loginId, password, nowDate);
	await updateMemberLoginSuccessLog(member.dataValues.id, loginIp, nowDate);

	return { member: { id: member.dataValues.id } };
};

export const addMember = async (memberData) => {
	const member = await memberComponent.getMemberByNameAndPhone(memberData.name, memberData.phone);

	let response = null;

	// 첫 회원 가입
	if (!member) {
		response = await sequelize.transaction(async (t) => {
			const memberId = await memberComponent.addMember(memberData, true, t);
			memberData.my_referral_code = generateReferralCode();
			await memberComponent.addMemberInfo(memberId, memberData, t);
			await memberComponent.addMemberStatistic(memberId, t);
			return memberId;
		});
		return response;
	}

	// 기존에 일반 회원 가입 한 내역 있음
	if (member.dataValues.register_type === 'homepage') {
		throwError('Already joined member', 409);
	}

	// 기존 SNS 가입 회원 추가 가입
	if (member.dataValues.register_type === 'sns') {
		response = await sequelize.transaction(async (t) => {
			await memberComponent.updateMemberLoginData(member.dataValues.id, memberData, t);
			await memberComponent.updateMemberInfo(member.dataValues.id, memberData, t);
			return member.dataValues.id;
		});
	}
	return response;
};

export const updateMember = async (memberId, memberData) => {
	const response = await sequelize.transaction(async (t) => {
		const member = await memberComponent.updateMember(memberId, memberData, t);
		await memberComponent.updateMemberInfo(memberId, memberData, t);
		return member ? memberId : null;
	});
	return response;
};

export const getMembers = async (page, limit) => {
	const offset = limit * (page - 1);
	const members = await memberComponent.getMembers(limit, offset);
	return members;
};

export const getMember = async (memberId) => {
	const member = await memberComponent.getMemberDetailById(memberId);
	if (!member) throwError('No such member', 404);
	return member.dataValues;
};

export const withdrawalMember = async (memberId, comment) => {
	const nowDate = await commonComponent.nowDateTime();
	const outData = {
		memberId,
		comment,
	};
	await sequelize.transaction(async (t) => {
		await memberComponent.withdrawalMember(memberId, t);
		await memberComponent.addMemberOut(outData, nowDate, t);
	});

	return memberId;
};
