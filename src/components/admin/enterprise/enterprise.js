import { Sequelize } from 'sequelize';
import { getModel, Op } from '../../../database';

const Enterprise = getModel('Enterprise');
const EnterpriseInfo = getModel('EnterpriseInfo');
const EnterpriseStatistic = getModel('EnterpriseStatistic');
const EnterpriseLoginLog = getModel('EnterpriseLoginLog');

// 기업회원 목록조회
export const getEnterpriseList = async (enterpriseFilter, enterpriseInfoFilter, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: enterpriseFilter,
		include: [
			{
				model: EnterpriseInfo,
				attributes: ['name', 'company_reg_num', 'phone'],
				where: enterpriseInfoFilter,
			},
		],
		distinct: true,
	};

	// Total
	const total = await Enterprise.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'login_id', 'email'];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 게시물 정보 조회
		const enterpriseData = await Enterprise.findAll(sql);
		if (Object.keys(enterpriseData).length > 0) response = { total, list: enterpriseData };
	}

	// Return
	return response;
};

// 기업회원 상세 조회
export const getEnterpriseDetailById = async (enterpriseId) => {
	const response = await Enterprise.findOne({
		where: { id: enterpriseId },
		attributes: ['login_id', 'email', 'last_login_at', 'is_approved', 'is_out', 'is_blocked'],
		include: [
			{
				model: EnterpriseInfo,
				attributes: ['name', 'phone', 'zip_code', 'address1', 'address2', 'company_reg_file_key', 'company_reg_num'],
			},
			{
				model: EnterpriseStatistic,
				attributes: ['id', 'enterprise_total_point', 'enterprise_total_history_point'],
			},
		],
	});
	return response;
};

// 기업회원 기본정보 수정
export const updateEnterprise = async (enterpriseData, t) => {
	const response = await Enterprise.update(
		{
			login_id: enterpriseData.login_id,
			password: enterpriseData.password,
			email: enterpriseData.email,
			is_approved: enterpriseData.is_approved,
			is_blocked: enterpriseData.is_blocked,
			is_out: enterpriseData.is_out,
		},
		{ where: { id: enterpriseData.id }, transaction: t },
	);
	return response;
};

// 기업회원 상세정보 수정
export const updateEnterpriseInfo = async (enterpriseInfoData, t) => {
	const response = await EnterpriseInfo.update(
		{
			name: enterpriseInfoData.name,
			birthday: enterpriseInfoData.birthday,
			phone: enterpriseInfoData.phone,
			company_reg_file_key: enterpriseInfoData.company_reg_file_key,
			company_reg_num: enterpriseInfoData.company_reg_num,
		},
		{ where: { enterprise_id: enterpriseInfoData.enterprise_id }, transaction: t },
	);
	return response;
};

// 기업회원 로그인 이력조회
export const getEnterpriseLoginLogById = async (enterpriseId, offset = 0, limit = 10) => {
	const sql = { where: { enterprise_id: enterpriseId } };
	let response = null;

	const total = await EnterpriseLoginLog.count(sql);
	if (total && total > 0) {
		sql.attributes = ['enterprise_id', 'login_ip', 'created_at'];
		sql.limit = parseInt(limit, 10);
		sql.offset = parseInt(offset, 10);
		sql.order = [['created_at', 'DESC']];

		const loginLogs = await EnterpriseLoginLog.findAll(sql);
		if (Object.keys(loginLogs).length) response = { total, list: loginLogs };
	}
	return response;
};
