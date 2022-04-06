import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import { getModel, transaction } from '../../../database';
import * as commonComponent from '../../../components/common';

const Admin = getModel('Admin');
const AdminLoginLog = getModel('AdminLoginLog');

// UserId 로 관리자 회원 정보 조회
export const getAdminMemberByLoginId = async (loginId) => {
	const response = await Admin.findOne({ where: { login_id: loginId } });
	return response;
};

// Id 로 관리자 회원 정보 조회
export const getAdminMemberById = async (adminId) => {
	const response = await Admin.findOne({ attributes: ['id', 'login_id', 'password', 'name', 'email', 'is_deleted', 'created_at', 'updated_at'], where: { id: adminId } });
	return response;
};

// 괸리자 회원 로그인 로그 입력
export const addAdminMemberLoginLog = async (adminMemberLoginLog) => {
	const response = await AdminLoginLog.create({
		admin_id: adminMemberLoginLog.admin_id,
		login_ip: adminMemberLoginLog.login_ip,
		created_at: adminMemberLoginLog.created_at,
	});
	return response;
};

// 관리자 회원 최종로그인 수정
export const updateAdminMemberLastLogin = async (nowDate, adminMemberId) => {
	await Admin.update({ last_login_at: nowDate }, { where: { id: adminMemberId } });
};

// 관리자 회원 등록
export const addAdminMember = async (t, adminData, isGetId = false) => {
	const admin = adminData;
	admin.password = bcrypt.hashSync(admin.password, parseInt(process.env.PASSWORD_DEFAULT, 10));

	const response = await Admin.create(
		{
			member_id: admin.member_id,
			login_id: admin.login_id,
			password: admin.password,
			name: admin.name,
			email: admin.email,
			last_login_at: admin.lastLogin,
			is_deleted: 'N',
		},
		{ transaction: t },
	);

	return isGetId ? response.dataValues.id : response;
};
