import bcrypt from 'bcryptjs';
import Sequelize from 'sequelize';
import { getModel, transaction } from '../../database';
import * as commonComponent from '../../components/common';

const ProjectJobConfigTmp = getModel('ProjectJobConfigTmp');
const ProjectJobConfig = getModel('ProjectJobConfig');

// 프로젝트 작업 임시형식 생성
export const createProjectConfig = async (configData, t) => {
	const response = await ProjectJobConfigTmp.create(configData, { transaction: t });
	return response;
};

// 프로젝트 작업 형식 조회
export const getProjectConfig = async (projectId) => {
	const response = await ProjectJobConfigTmp.findOne({
		attributes: ['id', 'job_config_json'],
		where: { project_id: projectId },
		order: [['id', 'DESC']],
	});
	return response;
};

// 프로젝트 작업 형식 수정
export const updateProjectConfig = async (configData, t) => {
	const jobConfig = configData.job_config_json;
	const projectId = configData.project_id;
	const response = await ProjectJobConfigTmp.update({ job_config_json: jobConfig }, { where: { project_id: projectId }, transaction: t });

	return response;
};
