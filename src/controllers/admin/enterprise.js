import bcrypt from 'bcryptjs';

import * as enterpriseService from '../../services/admin/enterprise/enterprise';
import * as commonComponent from '../../components/common';

// 기업회원 목록조회
export const getEnterprises = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	const enterpriseSearchField = {};
	if (req.query.login_id) enterpriseSearchField.login_id = req.query.login_id;
	if (req.query.email) enterpriseSearchField.email = req.query.email;
	if (req.query.is_approved) enterpriseSearchField.is_approved = req.query.is_approved;
	if (req.query.created_at) enterpriseSearchField.created_at = req.query.created_at;
	if (Object.keys(enterpriseSearchField).length > 0) searchFields.enterprise = enterpriseSearchField;

	// enterpriseattributes
	const enterpriseInfoSearchField = {};
	if (req.query.name) enterpriseInfoSearchField.name = req.query.name;
	if (req.query.phone) enterpriseInfoSearchField.phone = await commonComponent.returnNumberOnly(req.query.phone);
	if (Object.keys(enterpriseInfoSearchField).length > 0) searchFields.info = enterpriseInfoSearchField;

	const enterpriseStatisticSearchField = {};
	if (req.query.enterprise_total_point) enterpriseStatisticSearchField.enterprise_total_point = req.query.enterprise_total_point;
	if (req.query.enterprise_total_history_point) enterpriseStatisticSearchField.enterprise_total_history_point = req.query.enterprise_total_history_point;
	if (Object.keys(enterpriseStatisticSearchField).length > 0) searchFields.statistic = enterpriseStatisticSearchField;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	const enterprises = await enterpriseService.getEnterprises(searchFields, offset, limit);

	return !enterprises ? null : { ...enterprises, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 기업회원 상세 조회
export const getEnterprise = async (req) => {
	const enterpriseId = req.params.enterprise_id;
	const response = await enterpriseService.getEnterprise(enterpriseId);
	return { enterprise: response };
};

// 기업회원 상세 수정
export const patchEnterprise = async (req) => {
	const enterpriseData = {
		id: req.params.enterprise_id,
		login_id: req.body.login_id,
		password: req.body.password ? bcrypt.hashSync(req.body.password, parseInt(process.env.PASSWORD_DEFAULT, 10)) : req.body.password,
		email: req.body.email,
		is_approved: req.body.is_approved,
		is_blocked: req.body.is_blocked,
		is_out: req.body.is_out,
	};

	const enterpriseInfoData = {
		enterprise_id: req.params.enterprise_id,
		name: req.body.name,
		phone: req.body.phone,
		company_reg_file_key: req.body.company_reg_file_key,
		company_reg_num: req.body.company_reg_num,
	};
	const response = await enterpriseService.patchEnterprise(enterpriseData, enterpriseInfoData);
	return { enterprise: response };
};

// 기업회원 로그인 이력 조회
export const getEnterpriseLoginLog = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);

	const enterpriseId = req.params.enterprise_id;
	const enterpriseLoginLogs = await enterpriseService.getEnterpriseLoginLog(enterpriseId, offset, limit);
	return !enterpriseLoginLogs ? null : { ...enterpriseLoginLogs, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};
