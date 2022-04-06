import * as enterpriseComponent from '../../../components/admin/enterprise/enterprise';
import { Op, sequelize } from '../../../database';
import { throwError } from '../..';

// 기업회원 목록 조회
export const getEnterprises = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const enterprise = searchFields.enterprise ? searchFields.enterprise : null;
	const enterpriseInfo = searchFields.info ? searchFields.info : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const enterpriseFilter = {};
	if (enterprise) {
		if (enterprise.created_at) enterpriseFilter.created_at = { [Op.gte]: enterprise.created_at };
		if (enterprise.login_id) enterpriseFilter.login_id = { [Op.like]: `%${enterprise.login_id}%` };
		if (enterprise.is_approved) enterpriseFilter.is_approved = enterprise.is_approved;
		if (enterprise.email) enterpriseFilter.email = { [Op.like]: `%${enterprise.email}%` };
	}

	const enterpriseInfoFilter = {};
	if (enterpriseInfo) {
		if (enterpriseInfo.name) enterpriseInfoFilter.name = { [Op.like]: `%${enterpriseInfo.name}%` };
		if (enterpriseInfo.phone) enterpriseInfoFilter.phone = { [Op.like]: `%${enterpriseInfo.phone}%` };
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
	}

	response = await enterpriseComponent.getEnterpriseList(enterpriseFilter, enterpriseInfoFilter, order, offset, limit);

	return response;
};

// 기업회원 상세조회
export const getEnterprise = async (enterpriseId) => {
	const enterprise = await enterpriseComponent.getEnterpriseDetailById(enterpriseId);
	return enterprise;
};

// 기업회원 상세 수정
export const patchEnterprise = async (enterpriseData, enterpriseInfoData) => {
	let response = null;

	await sequelize.transaction(async (t) => {
		const enterpriseResponse = await enterpriseComponent.updateEnterprise(enterpriseData, t);
		if (Object.keys(enterpriseResponse).keys > 0) response = enterpriseResponse;

		await enterpriseComponent.updateEnterpriseInfo(enterpriseInfoData, t);
	});

	return response;
};

// 기업회원 로그인 이력조회
export const getEnterpriseLoginLog = async (enterpriseId, offset = 0, limitParam = 10) => {
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;

	const enterpriseLoginLog = await enterpriseComponent.getEnterpriseLoginLogById(enterpriseId, offset, limit);
	return enterpriseLoginLog;
};
