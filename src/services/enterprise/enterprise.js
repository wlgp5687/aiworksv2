import bcrypt from 'bcryptjs';
import * as enterpriseComponent from '../../components/enterprise/enterprise';
import * as commonComponent from '../../components/common';
import { sequelize } from '../../database';
import { throwError } from '../index';

const updateEnterpriseLoginSuccessLog = async (enterpriseId, loginIp, nowDate) => {
	const response = await sequelize.transaction(async (t) => {
		await enterpriseComponent.updateEnterpriseLogin(enterpriseId, nowDate, t);
		await enterpriseComponent.addEnterpriseLoginLog(enterpriseId, loginIp, t);
		await enterpriseComponent.increaseEnterpriseStatisticLoginCount(enterpriseId, t);
		return enterpriseId;
	});
	return response;
};

export const addEnterprise = async (enterprise) => {
	const response = await sequelize.transaction(async (t) => {
		const enterpriseId = await enterpriseComponent.addEnterprise(enterprise, true, t);
		await enterpriseComponent.addEnterpriseInfo(enterpriseId, enterprise, t);
		await enterpriseComponent.addEnterpriseStatistic(enterpriseId, t);
		return enterpriseId;
	});
	return response;
};

export const getEnterpriseDetail = async (enterpriseId) => {
	const response = await enterpriseComponent.getEnterpriseDetailById(enterpriseId);
	return response;
};

export const updateEnterprise = async (enterpriseId, enterpriseData) => {
	const response = await sequelize.transaction(async (t) => {
		const enterprise = await enterpriseComponent.updateEnterprise(enterpriseId, enterpriseData, t);
		await enterpriseComponent.updateEnterpriseInfo(enterpriseId, enterpriseData, t);
		return enterprise ? enterprise.dataValues.id : null;
	});
	return response;
};

export const verifyEnterprise = async (loginId, password, nowDate) => {
	const enterprise = await enterpriseComponent.getEnterpriseByLoginId(loginId);
	if (!enterprise) throwError('회원 정보를 찾을 수 없습니다.', 400);

	// TODO 로그인 실패 카운트로 로그인 제한을 두는 실패 횟수, 제한 시간에 대한 기획 및 설정값 관리 방법 필요
	if (enterprise.dataValues.login_fail_cnt >= 5) {
		const now = new Date(nowDate);
		const lastLoginFailure = new Date(enterprise.dataValues.login_fail_date);

		const diffMins = Math.floor((now - lastLoginFailure) / 60000);
		if (diffMins < 15) {
			throwError('실패 횟수 초과로 15분간 로그인 할 수 없습니다.', 401);
		}
	}

	// check password
	if (!bcrypt.compareSync(password, enterprise.dataValues.password)) {
		await enterpriseComponent.increaseLoginFailureCount(enterprise.dataValues.id, nowDate);
		throwError('회원정보가 일치하지 않습니다.', 401);
	}

	if (enterprise.dataValues.is_deleted === 'Y' || enterprise.dataValues.is_out === 'Y') throwError('회원 정보를 찾을 수 없습니다.', 401);
	if (enterprise.dataValues.is_blocked === 'Y') throwError('블락된 회원입니다.', 403);

	return enterprise.dataValues.id;
};

export const doLogin = async (loginId, password, loginIp) => {
	const nowDate = await commonComponent.nowDateTime();
	const enterpriseId = await verifyEnterprise(loginId, password, nowDate);

	await updateEnterpriseLoginSuccessLog(enterpriseId, loginIp, nowDate);

	return { enterprise: { id: enterpriseId } };
};
