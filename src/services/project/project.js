import bcrypt from 'bcryptjs';
import { throwError } from '..';
import * as projectComponent from '../../components/project/project';
import * as commonComponent from '../../components/common';
import { sequelize } from '../../database';

// 프로젝트 형식 저장
export const postProjectConfig = async (configData) => {
	const response = await sequelize.transaction(async (t) => {
		return projectComponent.createProjectConfig(configData, t);
	});
	return response;
};

// 프로젝트 형식 조회
export const getProjectConfig = async (projectId) => {
	const response = await projectComponent.getProjectConfig(projectId);

	return response;
};

// 프로젝트 형식 수정
export const patchProjectConfig = async (configData) => {
	const response = await sequelize.transaction(async (t) => {
		return projectComponent.updateProjectConfig(configData, t);
	});

	return response;
};
