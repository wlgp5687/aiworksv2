import bcrypt from 'bcryptjs';
import { getModel } from '../../database';

const Member = getModel('Member');
const MemberInfo = getModel('MemberInfo');
const MemberExternal = getModel('MemberExternal');
const MemberLoginLog = getModel('MemberLoginLog');
const MemberStatistic = getModel('MemberStatistic');
const MemberOut = getModel('MemberOut');

export const addMember = async (memberData, isGetId = false, t) => {
	const member = memberData;
	member.password = bcrypt.hashSync(member.password, parseInt(process.env.PASSWORD_DEFAULT, 10));

	const response = await Member.create(
		{
			login_id: member.login_id,
			password: member.password,
			name: member.name,
			email: member.email,
			last_login_at: member.last_login_at,
			register_type: member.register_type,
		},
		{ transaction: t },
	);

	return isGetId ? response.dataValues.id : response;
};

export const updateMemberLoginData = async (memberId, memberData, t) => {
	const password = bcrypt.hashSync(memberData.password, parseInt(process.env.PASSWORD_DEFAULT, 10));
	const response = await Member.update(
		{
			login_id: memberData.login_id,
			password,
			register_type: memberData.register_type,
		},
		{ where: { id: memberId } },
		{ transaction: t },
	);
	return response;
};

export const addMemberInfo = async (memberId, memberData, t) => {
	const response = await MemberInfo.create(
		{
			member_id: memberId,
			name: memberData.name,
			birthday: memberData.birthday,
			gender_cd: memberData.gender_cd,
			age_cd: memberData.age_cd,
			region_cd: memberData.age_cd,
			phone: memberData.phone,
			zip_code: memberData.zip_code,
			address1: memberData.address1,
			address2: memberData.address2,
			is_sms: memberData.is_sms,
			is_email: memberData.is_email,
			thumbnail_file_key: memberData.thumbnail_file_key,
			my_referral_code: memberData.my_referral_code,
			bank_cd: memberData.bank_cd,
			account_name: memberData.account_name,
			account_num: memberData.account_num,
		},
		{ transaction: t },
	);
	return response;
};

export const updateMember = async (memberId, memberData, t) => {
	const password = bcrypt.hashSync(memberData.password, parseInt(process.env.PASSWORD_DEFAULT, 10));
	const response = await Member.update(
		{
			password,
			email: memberData.email,
		},
		{ where: { id: memberId } },
		{ transaction: t },
	);
	return response;
};

export const updateMemberInfo = async (memberId, memberInfo, t) => {
	const response = await MemberInfo.update(
		{
			name: memberInfo.name,
			birthday: memberInfo.birthday,
			gender_cd: memberInfo.gender_cd,
			age_cd: memberInfo.age_cd,
			region_cd: memberInfo.region_cd,
			phone: memberInfo.phone,
			zip_code: memberInfo.zip_code,
			address1: memberInfo.address1,
			address2: memberInfo.address2,
			is_sms: memberInfo.is_sms,
			is_email: memberInfo.is_email,
			thumbnail_file_key: memberInfo.thumbnail_file_key,
			my_referral_code: memberInfo.my_referral_code,
			bank_cd: memberInfo.bank_cd,
			account_name: memberInfo.account_name,
			account_num: memberInfo.account_num,
		},
		{ where: { member_id: memberId } },
		{ transaction: t },
	);

	return response;
};

export const addMemberLoginLog = async (memberId, loginIp, t) => {
	const response = await MemberLoginLog.create(
		{
			member_id: memberId,
			login_ip: loginIp,
		},
		{ transaction: t },
	);
	return response;
};

export const addMemberStatistic = async (memberId, t) => {
	const response = await MemberStatistic.create(
		{
			member_id: memberId,
		},
		{ transaction: t },
	);
	return response;
};

export const getMemberById = async (memberId, t = null) => {
	const response = await Member.findOne({ where: { id: memberId } }, { transaction: t });
	return response;
};

export const getMemberByPhone = async (phone) => {
	const response = await Member.findOne({
		include: [{ model: MemberInfo, where: { phone } }],
	});
	return response;
};

export const getMemberByNameAndPhone = async (name, phone) => {
	const response = await Member.findOne({
		include: [{ model: MemberInfo, where: { name, phone } }],
	});
	return response;
};

export const getMemberByLoginId = async (loginId) => {
	const response = await Member.findOne({ where: { login_id: loginId } });
	return response;
};

export const getMembers = async (limit, offset) => {
	const response = await Member.findAll({
		attributes: ['login_id', 'email', 'last_login_at', 'is_approved'],
		offset,
		limit,
	});
	return response;
};

export const getMemberDetailById = async (memberId) => {
	const response = await Member.findOne({
		attributes: ['login_id', 'email', 'last_login_at', 'is_approved'],
		where: { id: memberId },
		include: [
			{
				model: MemberInfo,
				required: false,
				attributes: [
					'name',
					'birthday',
					'gender_cd',
					'age_cd',
					'region_cd',
					'phone',
					'zip_code',
					'address1',
					'address2',
					'is_sms',
					'is_email',
					'thumbnail_file_key',
					'my_referral_code',
					'bank_cd',
					'account_name',
					'account_num',
				],
			},
			{
				model: MemberStatistic,
				attributes: ['id', 'member_total_point', 'member_total_history_point'],
				distinct: false,
			},
		],
	});
	return response;
};

export const addMemberExternal = async (memberId, joinTypeCode, token, t) => {
	const response = await MemberExternal.create(
		{
			member_id: memberId,
			join_type_cd: joinTypeCode,
			token,
		},
		{ transaction: t },
	);
	return response;
};

export const getMemberExternalByJoinTypeCodeAndToken = async (joinTypeCode, token) => {
	const response = await MemberExternal.findOne({ where: { join_type_cd: joinTypeCode, token } });
	return response;
};

export const getMemberByMemberExternalJoinTypeAndToken = async (joinTypeCode, token) => {
	const response = await Member.findOne({
		include: [{ model: MemberExternal, where: { join_type_cd: joinTypeCode, token } }],
	});
	return response;
};

export const updateMemberLogin = async (memberId, loginDate, t) => {
	const response = await Member.update(
		{
			login_fail_cnt: 0,
			last_login_at: loginDate,
		},
		{ where: { id: memberId } },
		{ transaction: t },
	);
	return response;
};

export const increaseMemberStatisticLoginCount = async (memberId, t) => {
	const response = await MemberStatistic.increment(
		{
			member_total_login_cnt: 1,
		},
		{ where: { member_id: memberId } },
		{ transaction: t },
	);
	return response;
};

export const addAdminMemberLoginLog = async (memberLoginLog) => {
	const response = await MemberLoginLog.create({
		admin_id: memberLoginLog.member_id,
		login_ip: memberLoginLog.login_ip,
		created_at: memberLoginLog.created_at,
	});
	return response;
};

export const increaseLoginFailureCount = async (memberId, nowDate) => {
	const member = await getMemberById(memberId);
	const response = await Member.update(
		{
			login_fail_cnt: member.dataValues.login_fail_cnt + 1,
			login_fail_date: nowDate,
		},
		{ where: { id: memberId } },
	);
	return response;
};

export const withdrawalMember = async (memberId, t) => {
	const response = await Member.update(
		{
			is_deleted: 'Y',
		},
		{ where: { id: memberId } },
		{ transaction: t },
	);
	return response;
};

export const addMemberOut = async (outData, nowDate, t) => {
	const response = await MemberOut.create(
		{
			member_id: outData.id,
			out_at: nowDate,
			comment: outData.comment,
		},
		{ transaction: t },
	);
	return response;
};
