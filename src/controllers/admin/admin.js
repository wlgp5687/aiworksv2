import * as adminService from '../../services/admin/admin/admin';
import * as jwtService from '../../services/auth/jwt';

// 관리자 회원 로그인
export const login = async (req) => {
	const loginIp = req.body.login_ip ? req.body.login_ip : req.ipAddress;

	// 로그인 처리
	const adminMemberLoginData = await adminService.doLogin(req.body.login_id, req.body.password, loginIp);

	// 로그인 정보가 담긴 토큰 재발급 처리
	const refreshedToken = await jwtService.refreshToken(req.csrfToken(), req.encodedToken, adminMemberLoginData, true);

	return refreshedToken;
};

// 관리자 회원 등록
export const register = async (req) => {
	let response = null;
	// 요청 변수 정리
	const admin = {
		member_id: req.body.member_id,
		login_id: req.body.login_id,
		password: req.body.password,
		name: req.body.name,
		email: req.body.email,
	};

	// 회원 등록
	response = await adminService.addAdminMember(admin);

	// Return
	return { admin: response };
};
