import bcrypt from 'bcryptjs';
import { getModel } from '../../database';

const Enterprise = getModel('Enterprise');
const EnterpriseInfo = getModel('EnterpriseInfo');
const EnterpriseLoginLog = getModel('EnterpriseLoginLog');
const EnterpriseStatistic = getModel('EnterpriseStatistic');

export const addEnterprise = async (enterpriseData, isGetId = false, t) => {
	const password = bcrypt.hashSync(enterpriseData.password, parseInt(process.env.PASSWORD_DEFAULT, 10));

	const response = await Enterprise.create(
		{
			login_id: enterpriseData.login_id,
			password,
			email: enterpriseData.email,
		},
		{ transaction: t },
	);

	return isGetId ? response.dataValues.id : response;
};

export const updateEnterprise = async (enterpriseId, enterpriseData, t) => {
	const password = enterpriseData.password ? bcrypt.hashSync(enterpriseData.password, parseInt(process.env.PASSWORD_DEFAULT, 10)) : null;
	const response = await Enterprise.update(
		{
			password,
			email: enterpriseData.email,
		},
		{ where: { id: enterpriseId } },
		{ transaction: t },
	);

	return response;
};

export const addEnterpriseInfo = async (enterpriseId, enterpriseData, t) => {
	const response = await EnterpriseInfo.create(
		{
			enterprise_id: enterpriseId,
			name: enterpriseData.name,
			phone: enterpriseData.phone,
			zip_code: enterpriseData.zip_code,
			address1: enterpriseData.address1,
			address2: enterpriseData.address2,
			company_reg_file_key: enterpriseData.company_reg_file_key,
			company_reg_num: enterpriseData.company_reg_num,
			thumbnail_file_key: enterpriseData.thumbnail_file_key,
		},
		{ transaction: t },
	);

	return response;
};

export const updateEnterpriseInfo = async (enterpriseId, enterpriseData, t) => {
	const response = await EnterpriseInfo.update(
		{
			name: enterpriseData.name,
			phone: enterpriseData.phone,
			zip_code: enterpriseData.zip_code,
			address1: enterpriseData.address1,
			address2: enterpriseData.address2,
			company_reg_file_key: enterpriseData.company_reg_file_key,
			company_reg_num: enterpriseData.company_reg_num,
			thumbnail_file_key: enterpriseData.thumbnail_file_key,
		},
		{ where: { id: enterpriseId } },
		{ transaction: t },
	);

	return response;
};

export const getEnterpriseById = async (enterpriseId) => {
	const response = await Enterprise.findOne({ where: { id: enterpriseId } });
	return response;
};

export const getEnterpriseByLoginId = async (loginId) => {
	const response = await Enterprise.findOne({ where: { login_id: loginId } });
	return response;
};

export const getEnterpriseDetailById = async (enterpriseId) => {
	const response = await Enterprise.findOne({
		attributes: ['login_id', 'email', 'last_login_at', 'is_approved'],
		where: { id: enterpriseId },
		include: [
			{
				model: EnterpriseInfo,
				required: false,
				attributes: ['name', 'phone', 'zip_code', 'address1', 'address2', 'company_reg_file_key', 'company_reg_num', 'thumbnail_file_key'],
			},
		],
	});
	return response;
};

export const increaseLoginFailureCount = async (enterpriseId, nowDate) => {
	const enterprise = await getEnterpriseById(enterpriseId);
	const response = await Enterprise.update(
		{
			login_fail_cnt: enterprise.dataValues.login_fail_cnt + 1,
			login_fail_date: nowDate,
		},
		{ where: { id: enterpriseId } },
	);
	return response;
};

export const updateEnterpriseLogin = async (enterpriseId, loginDate, t) => {
	const response = await Enterprise.update(
		{
			login_fail_cnt: 0,
			last_login_at: loginDate,
		},
		{ where: { id: enterpriseId } },
		{ transaction: t },
	);
	return response;
};

export const addEnterpriseLoginLog = async (enterpriseId, loginIp, t) => {
	const response = await EnterpriseLoginLog.create(
		{
			enterprise_id: enterpriseId,
			login_ip: loginIp,
		},
		{ transaction: t },
	);
	return response;
};

export const addEnterpriseStatistic = async (enterpriseId, t) => {
	const response = await EnterpriseStatistic.create(
		{
			enterprise_id: enterpriseId,
		},
		{ transaction: t },
	);
	return response;
};

export const increaseEnterpriseStatisticLoginCount = async (enterpriseId, t) => {
	const response = await EnterpriseStatistic.increment(
		{
			enterprise_total_login_cnt: 1,
		},
		{ where: { enterprise_id: enterpriseId } },
		{ transaction: t },
	);
	return response;
};
