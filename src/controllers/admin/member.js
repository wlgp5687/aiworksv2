import bcrypt from 'bcryptjs';

import * as memberService from '../../services/admin/member/member';
import * as commonComponent from '../../components/common';

// 일반회원 목록조회
export const getMembers = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	const memberSearchField = {};
	if (req.query.login_id) memberSearchField.login_id = req.query.login_id;
	if (req.query.email) memberSearchField.email = req.query.email;
	if (req.query.is_approved) memberSearchField.is_approved = req.query.is_approved;
	if (req.query.register_type) memberSearchField.register_type = req.query.register_type;
	if (req.query.created_at) memberSearchField.created_at = req.query.created_at;
	if (Object.keys(memberSearchField).length > 0) searchFields.member = memberSearchField;

	// memberattributes
	const memberInfoSearchField = {};
	if (req.query.name) memberInfoSearchField.name = req.query.name;
	if (req.query.region_cd) memberInfoSearchField.region_cd = req.query.region_cd;
	if (req.query.age_cd) memberInfoSearchField.age_cd = req.query.age_cd;
	if (req.query.gender_cd) memberInfoSearchField.gender_cd = req.query.gender_cd;
	if (req.query.phone) memberInfoSearchField.phone = await commonComponent.returnNumberOnly(req.query.phone);
	if (Object.keys(memberInfoSearchField).length > 0) searchFields.info = memberInfoSearchField;

	const memberStatisticSearchField = {};
	if (req.query.member_total_point) memberStatisticSearchField.member_total_point = req.query.member_total_point;
	if (req.query.member_total_history_point) memberStatisticSearchField.member_total_history_point = req.query.member_total_history_point;
	if (Object.keys(memberStatisticSearchField).length > 0) searchFields.statistic = memberStatisticSearchField;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	const members = await memberService.getMembers(searchFields, offset, limit);

	return !members ? null : { ...members, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 일반회원 상세 조회
export const getMember = async (req) => {
	const memberId = req.params.member_id;
	const response = await memberService.getMember(memberId);
	return { member: response };
};

// 일반회원 상세 수정
export const patchMember = async (req) => {
	const memberData = {
		id: req.params.member_id,
		login_id: req.body.login_id,
		password: req.body.password ? bcrypt.hashSync(req.body.password, parseInt(process.env.PASSWORD_DEFAULT, 10)) : req.body.password,
		email: req.body.email,
		is_approved: req.body.is_approved,
		is_blocked: req.body.is_blocked,
		is_out: req.body.is_out,
	};

	const memberInfoData = {
		member_id: req.params.member_id,
		name: req.body.name,
		birthday: req.body.birthday,
		gender_cd: req.body.gender_cd,
		age_cd: req.body.age_cd,
		region_cd: req.body.region_cd,
		phone: req.body.phone,
		is_sms: req.body.is_sms,
		is_email: req.body.is_email,
	};
	const response = await memberService.patchMember(memberData, memberInfoData);
	return { member: response };
};

// 일반회원 로그인 이력 조회
export const getMemberLoginLog = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);

	const memberId = req.params.member_id;
	const memberLoginLogs = await memberService.getMemberLoginLog(memberId, offset, limit);
	return !memberLoginLogs ? null : { ...memberLoginLogs, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 일반회원 프로젝트 이력 조회
export const getMemberProjectLog = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const memberId = req.params.member_id;

	const memberProjectLogSearchField = {};
	if (req.query.project_code) memberProjectLogSearchField.project_code = req.query.project_code;
	if (req.query.project_type_cd) memberProjectLogSearchField.project_type_cd = req.query.project_type_cd;
	if (req.query.project_status_cd) memberProjectLogSearchField.project_status_cd = req.query.project_status_cd;
	if (req.query.name) memberProjectLogSearchField.name = req.query.name;

	const memberProjectLogs = await memberService.getMemberProjectLog(memberProjectLogSearchField, memberId, offset, limit);
	return !memberProjectLogs ? null : { ...memberProjectLogs, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};
