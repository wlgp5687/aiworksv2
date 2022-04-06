import * as memberComponent from '../../../components/admin/member/member';
import { Op, sequelize } from '../../../database';

// 일반회원 목록 조회
export const getMembers = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const member = searchFields.member ? searchFields.member : null;
	const memberInfo = searchFields.info ? searchFields.info : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const memberFilter = {};
	if (member) {
		if (member.created_at) memberFilter.created_at = { [Op.gte]: member.created_at };
		if (member.login_id) memberFilter.login_id = { [Op.like]: `%${member.login_id}%` };
		if (member.is_approved) memberFilter.is_approved = member.is_approved;
		if (member.email) memberFilter.email = { [Op.like]: `%${member.email}%` };
		if (member.register_type) memberFilter.register_type = member.register_type;
	}

	const memberInfoFilter = {};
	if (memberInfo) {
		if (memberInfo.name) memberInfoFilter.name = { [Op.like]: `%${memberInfo.name}%` };
		if (memberInfo.phone) memberInfoFilter.phone = { [Op.like]: `%${memberInfo.phone}%` };
		if (memberInfo.gender_cd) memberInfoFilter.gender_cd = memberInfo.gender_cd;
		if (memberInfo.region_cd) memberInfoFilter.region_cd = memberInfo.region_cd;
		if (memberInfo.age_cd) memberInfoFilter.age_cd = memberInfo.age_cd;
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
	}

	response = await memberComponent.getMemberList(memberFilter, memberInfoFilter, order, offset, limit);

	return response;
};

// 일반회원 상세조회
export const getMember = async (memberId) => {
	const member = await memberComponent.getMemberDetailById(memberId);
	return member;
};

// 일반회원 상세 수정
export const patchMember = async (memberData, memberInfoData) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const memberResponse = await memberComponent.updateMember(memberData, t);
		if (Object.keys(memberResponse).keys > 0) response = memberResponse;

		await memberComponent.updateMemberInfo(memberInfoData, t);
	});

	return response;
};

// 일반회원 로그인 이력조회
export const getMemberLoginLog = async (memberId, offset = 0, limitParam = 10) => {
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const memberLoginLog = await memberComponent.getMemberLoginLogById(memberId, offset, limit);
	return memberLoginLog;
};

// 일반회원 프로젝트 이력조회
export const getMemberProjectLog = async (projectLogSearchField, memberId, offset = 0, limitParam = 10) => {
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const projectLogFilter = {};
	if (projectLogSearchField) {
		if (projectLogSearchField.project_type_cd) projectLogFilter.project_type_cd = projectLogSearchField.project_type_cd;
		if (projectLogSearchField.project_code) projectLogFilter.project_code = { [Op.like]: `%${projectLogSearchField.project_code}%` };
		if (projectLogSearchField.project_status_cd) projectLogFilter.project_status_cd = projectLogSearchField.project_status_cd;
		if (projectLogSearchField.name) projectLogFilter.name = { [Op.like]: `%${projectLogSearchField.name}%` };
	}

	const memberProject = await memberComponent.getMemberProjectLogById(projectLogFilter, memberId, offset, limit);
	return memberProject;
};
