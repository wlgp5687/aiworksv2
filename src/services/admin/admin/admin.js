import bcrypt from 'bcryptjs';
import { throwError } from '../..';
import * as adminComponent from '../../../components/admin/admin/admin';
import * as commonComponent from '../../../components/common';
import { sequelize } from '../../../database';

// 관리자 회원 로그인
export const doLogin = async (loginId, password, loginIp) => {
	const nowDate = await commonComponent.nowDateTime()
	let adminMemberId = null;

	// 관리자 회원 로그인 검증
	adminMemberId = await verifyAdminMember(loginId, password);

	if (!adminMemberId) throwError('회원정보가 일치하지 않습니다.', 401);

	// 관리자 회원 삭제에 따른 처리
	const adminMemberInfo = await adminComponent.getAdminMemberById(adminMemberId);
	if (adminMemberInfo.dataValues.is_deleted === 'Y') throwError('회원 정보를 찾을 수 없습니다.', 401);

	// 관리자 회원 접속 정보 추가
	await adminComponent.addAdminMemberLoginLog({
		admin_id: adminMemberInfo.dataValues.id,
		login_ip: loginIp,
		created_at: nowDate,
	});

	// 관리자 회원 최종로그인 수정
	await adminComponent.updateAdminMemberLastLogin(nowDate, adminMemberId);

	// Return
	return { member: { id: adminMemberInfo.dataValues.member_id }, admin: { id: adminMemberInfo.dataValues.id } };
};

// 아이디와 비밀번호가 일치하면 관리자 회원 id 리턴
export const verifyAdminMember = async (loginId, password) => {
	const adminMember = await adminComponent.getAdminMemberByLoginId(loginId);
	// 일치하는 아이디가 없는 경우
	if (!adminMember) throwError('Invalid values', 400);
	// 패스워드 검증 및 Return
	return bcrypt.compareSync(password, adminMember.dataValues.password) ? adminMember.dataValues.id : null;
};

// 관리자 회원 등록
export const addAdminMember = async (adminData) => {
	adminData.lastLogin = await commonComponent.nowDateTime();
	const response = await sequelize.transaction(async (t) => { 
		return adminComponent.addAdminMember(t, adminData, false)
	});
	return response;
};
