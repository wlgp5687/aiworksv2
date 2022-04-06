import * as enterpriseService from '../services/enterprise/enterprise';
import * as jwtService from '../services/auth/jwt';

export const register = async (req) => {
	const enterprise = {
		login_id: req.body.login_id,
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		phone: req.body.phone,
		zip_code: req.body.zip_code,
		address1: req.body.address1,
		address2: req.body.address2,
		company_reg_file_key: req.body.company_reg_file_key,
		company_reg_num: req.body.company_reg_num,
		thumbnail_file_key: req.body.thumbnail_file_key,
	};

	const response = await enterpriseService.addEnterprise(enterprise);
	return { enterprise: response };
};

export const getEnterprise = async (req) => {
	const { enterpriseId } = req.params;
	const response = await enterpriseService.getEnterpriseDetail(enterpriseId);
	return { enterprise: response };
};

export const getEnterpriseByToken = async (req) => {
	const { id } = req.decodedToken.data.enterprise;
	const response = await enterpriseService.getEnterpriseDetail(id);
	return { enterprise: response };
};

export const updateEnterpriseByToken = async (req) => {
	const { id } = req.decodedToken.data.enterprise;
	const enterpriseData = {
		password: req.body.password,
		email: req.body.email,
		name: req.body.name,
		phone: req.body.phone,
		zip_code: req.body.zip_code,
		address1: req.body.address1,
		address2: req.body.address2,
		company_reg_file_key: req.body.company_reg_file_key,
		company_reg_num: req.body.company_reg_num,
		thumbnail_file_key: req.body.thumbnail_file_key,
	};

	const response = await enterpriseService.updateEnterprise(id, enterpriseData);
	return { enterprise: response };
};

export const login = async (req) => {
	const loginIp = req.body.login_ip ? req.body.login_ip : req.ipAddress;
	const { id, password } = req.body;

	const enterpriseLoginData = await enterpriseService.doLogin(id, password, loginIp);
	const refreshToken = await jwtService.refreshToken(req.csrfToken(), req.encodedToken, enterpriseLoginData, true);

	return { token: refreshToken };
};
