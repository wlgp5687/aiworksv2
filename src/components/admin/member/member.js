import { getModel } from '../../../database';

const Member = getModel('Member');
const MemberInfo = getModel('MemberInfo');
const MemberStatistic = getModel('MemberStatistic');
const MemberLoginLog = getModel('MemberLoginLog');
const ProjectMember = getModel('ProjectMember');
const Project = getModel('Project');
const Code = getModel('Code');

// 일반회원 목록조회
export const getMemberList = async (memberFilter, memberInfoFilter, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: memberFilter,
		include: [
			{
				model: MemberInfo,
				attributes: ['name', 'phone'],
				include: [
					{
						model: Code,
						as: 'gender',
						attributes: ['id', 'code', 'code_name'],
						where: { code_type: 'gender' },
						required: false,
					},
					{
						model: Code,
						as: 'age',
						attributes: ['id', 'code', 'code_name'],
						where: { code_type: 'age' },
						required: false,
					},
					{
						model: Code,
						as: 'region',
						attributes: ['id', 'code', 'code_name'],
						where: { code_type: 'region' },
						required: false,
					},
				],
				where: memberInfoFilter,
			},
			{
				model: MemberStatistic,
				attributes: ['id', 'member_total_point', 'member_total_history_point'],
				distinct: false,
			},
		],
		distinct: true,
	};

	// Total
	const total = await Member.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'login_id', 'email', 'register_type', 'created_at'];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const memberData = await Member.findAll(sql);
		if (Object.keys(memberData).length > 0) response = { total, list: memberData };
	}

	// Return
	return response;
};

// 일반회원 상세 조회
export const getMemberDetailById = async (memberId) => {
	const response = await Member.findOne({
		where: { id: memberId },
		attributes: ['login_id', 'email', 'last_login_at', 'is_approved', 'is_out', 'is_blocked', 'register_type'],
		include: [
			{
				model: MemberInfo,
				attributes: ['name', 'birthday', 'phone', 'gender_cd', 'age_cd', 'region_cd', 'is_sms', 'is_email', 'my_referral_code', 'zip_code', 'address1', 'address2'],
			},
			{
				model: MemberStatistic,
				attributes: ['id', 'member_total_point', 'member_total_history_point'],
			},
		],
	});
	return response;
};

// 일반회원 기본정보 수정
export const updateMember = async (memberData, t) => {
	const response = await Member.update(
		{
			login_id: memberData.login_id,
			password: memberData.password,
			email: memberData.email,
			is_approved: memberData.is_approved,
			is_blocked: memberData.is_blocked,
			is_out: memberData.is_out,
		},
		{ where: { id: memberData.id }, transaction: t },
	);
	return response;
};

// 일반회원 상세정보 수정
export const updateMemberInfo = async (memberInfoData, t) => {
	const response = await MemberInfo.update(
		{
			name: memberInfoData.name,
			birthday: memberInfoData.birthday,
			gender_cd: memberInfoData.gender_cd,
			age_cd: memberInfoData.age_cd,
			region_cd: memberInfoData.region_cd,
			phone: memberInfoData.phone,
			is_sms: memberInfoData.is_sms,
			is_email: memberInfoData.is_email,
		},
		{ where: { member_id: memberInfoData.member_id }, transaction: t },
	);
	return response;
};

// 일반회원 로그인 이력조회
export const getMemberLoginLogById = async (memberId, offset = 0, limit = 10) => {
	const sql = { where: { member_id: memberId } };
	let response = null;

	const total = await MemberLoginLog.count(sql);
	if (total && total > 0) {
		sql.attributes = ['member_id', 'login_ip', 'created_at'];
		sql.limit = parseInt(limit, 10);
		sql.offset = parseInt(offset, 10);
		sql.order = [['created_at', 'DESC']];

		const loginLogs = await MemberLoginLog.findAll(sql);
		if (Object.keys(loginLogs).length) response = { total, list: loginLogs };
	}
	return response;
};

// 일반회원 프로젝트 이력조회
export const getMemberProjectLogById = async (projectLogFilter, memberId, offset = 0, limit = 10) => {
	const sql = { where: { member_id: memberId } };
	let response = null;

	const total = await ProjectMember.count(sql);
	if (total && total > 0) {
		sql.attributes = ['project_role_cd'];
		sql.include = [
			{
				model: Project,
				attributes: ['project_code', 'project_type_cd', 'project_category_cd', 'project_status_cd', 'name'],
				where: projectLogFilter,
			},
		];
		sql.limit = parseInt(limit, 10);
		sql.offset = parseInt(offset, 10);
		sql.order = [['created_at', 'DESC']];

		const memberProjectLogs = await ProjectMember.findAll(sql);
		if (Object.keys(memberProjectLogs).length) response = { total, list: memberProjectLogs };
	}
	return response;
};
