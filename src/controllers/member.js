import * as memberService from '../services/member/member';
import * as jwtService from '../services/auth/jwt';

export const getMembers = async (req) => {
	const { page, limit } = req.query;
	const response = await memberService.getMembers(Number(page), Number(limit));
	return { members: response };
};

export const getMember = async (req) => {
	const { memberId } = req.params;
	const response = await memberService.getMember(memberId);
	return { member: response };
};

export const getMemberByToken = async (req) => {
	const { id } = req.decodedToken.data.member;
	const response = await memberService.getMember(id);
	return { member: response };
};

export const register = async (req) => {
	const member = {
		login_id: req.body.login_id,
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		birthday: req.body.birthday,
		gender_cd: req.body.gender_cd,
		age_cd: req.body.age_cd,
		region_cd: req.body.region_cd,
		phone: req.body.phone,
		zip_code: req.body.zip_code,
		address1: req.body.address1,
		address2: req.body.address2,
		is_sms: req.body.is_sms,
		is_email: req.body.is_email,
		thumbnail_file_key: req.body.thumbnail_file_key,
		bank_cd: req.body.bank_cd,
		account_name: req.body.account_name,
		account_num: req.body.account_num,
		register_type: 'homepage',
	};

	const response = await memberService.addMember(member);
	return { member: response };
};

export const updateMemberByToken = async (req) => {
	const { id } = req.decodedToken.data.member;
	const memberData = {
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		birthday: req.body.birthday,
		gender_cd: req.body.gender_cd,
		age_cd: req.body.age_cd,
		region_cd: req.body.region_cd,
		phone: req.body.phone,
		zip_code: req.body.zip_code,
		address1: req.body.address1,
		address2: req.body.address2,
		is_sms: req.body.is_sms,
		is_email: req.body.is_email,
		thumbnail_file_key: req.body.thumbnail_file_key,
		bank_cd: req.body.bank_cd,
		account_name: req.body.account_name,
		account_num: req.body.account_num,
	};
	const response = await memberService.updateMember(id, memberData);
	return { member: response };
};

export const login = async (req) => {
	const loginIp = req.body.login_ip ? req.body.login_ip : req.ipAddress;
	const { id, password } = req.body;

	const memberLoginData = await memberService.doLogin(id, password, loginIp);
	const refreshToken = await jwtService.refreshToken(req.csrfToken(), req.encodedToken, memberLoginData, true);

	return { token: refreshToken };
};

export const withdrawalByToken = async (req) => {
	const { id } = req.decodedToken.data.member;
	const { comment } = req.body;
	const response = await memberService.withdrawalMember(id, comment);
	return { member: response };
};
