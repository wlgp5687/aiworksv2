import * as projectComponent from '../../../components/admin/project/project';
import * as commonComponent from '../../../components/common';
import { sequelize, Op } from '../../../database';

// 프로젝트 생성
export const createProject = async (project, projectContent, projectConfig) => {
	const projectData = project;
	const projectContentData = projectContent;
	const response = await sequelize.transaction(async (t) => {
		// 프로젝트 생성
		projectData.project_code = await commonComponent.getProjectCode(projectData.project_type_cd);
		const projectResponse = await projectComponent.createProject(projectData, t);
		const projectId = projectResponse.dataValues.id;
		// 프로젝트 상세내용 생성
		projectContentData.project_id = projectId;
		await projectComponent.createProjectContentById(projectContentData, t);
		// 프로젝트 형식 생성
		const projectConfigData = {
			job_config_json: projectConfig,
			project_id: projectId,
			version: 1,
		};

		await projectComponent.createProjectConfigById(projectConfigData, t);

		return projectResponse;
	});
	return response;
};

// 프로젝트 수정
export const patchProject = async (projectId, projectData, projectContent, projectConfig) => {
	const response = await sequelize.transaction(async (t) => {
		if (Object.keys(projectData).length > 0) {
			await projectComponent.updateProjectById(projectId, projectData, t);
		}

		if (Object.keys(projectContent).length > 0) {
			await projectComponent.updateProjectContentById(projectId, projectContent, t);
		}

		if (Object.keys(projectConfig).length > 0) {
			// 프로젝트 형식 최신버전 조회
			const configData = await projectComponent.getConfigByProjectId(projectId);
			const projectConfigData = {
				project_id: projectId,
				job_config_json: projectConfig,
				version: configData.dataValues.version + 1,
			};

			await projectComponent.createProjectConfigById(projectConfigData, t);
		}
	});
	return response;
};

// 프로젝트 상세조회
export const getProjectDetail = async (projectId) => {
	const response = await projectComponent.getProjectDetailById(projectId);
	response.dataValues.ProjectJobConfig = await projectComponent.getConfigByProjectId(projectId);

	return response;
};

// 프로젝트 목록조회
export const getProjectList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const projectInfo = searchFields.projectInfo ? searchFields.projectInfo : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const projectAttr = {};
	if (projectInfo) {
		if (projectInfo.is_deleted) projectAttr.is_deleted = projectInfo.is_deleted;
		if (projectInfo.project_type_cd) projectAttr.project_type_cd = projectInfo.project_type_cd;
		if (projectInfo.project_code) projectAttr.project_code = { [Op.like]: `%${projectInfo.project_code}%` };
		if (projectInfo.project_category_cd) projectAttr.project_category_cd = projectInfo.project_category_cd;
		if (projectInfo.name) projectAttr.name = { [Op.like]: `%${projectInfo.name}%` };
		if (projectInfo.is_secret) projectAttr.is_secret = projectInfo.is_secret;
		if (projectInfo.is_volunteer) projectAttr.is_volunteer = projectInfo.is_volunteer;
		if (projectInfo.start_date) projectAttr.start_date = { [Op.gte]: projectInfo.start_date };
		if (projectInfo.end_date) projectAttr.end_date = { [Op.lte]: projectInfo.end_date };
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
		if (common.order === 'last_project_id') order.push(['id', 'DESC']);
		if (common.order === 'first_project_id') order.push(['id', 'ASC']);
	}

	response = await projectComponent.getProjectList(projectAttr, order, offset, limit);

	return response;
};

// 프로젝트 형식 조회
export const getProjectConfig = async (projectId) => {
	const response = await projectComponent.getConfigByProjectId(projectId);

	return response;
};

// 프로젝트 삭제
export const deleteProject = async (projectId, projectData) => {
	const response = await sequelize.transaction(async (t) => {
		await projectComponent.updateProjectById(projectId, projectData, t);
	});

	return response;
};

// 프로젝트 참여자 등록
export const postProjectMember = async (projectId, memberList) => {
	const response = await sequelize.transaction(async (t) => {
		const projectMemberData = [];
		for (let i = 0; i < memberList.length; i += 1) {
			projectMemberData.push({
				project_id: projectId,
				member_id: memberList[i],
				is_approved: 'Y',
				project_role_cd: 'WORKER',
			});
		}

		await projectComponent.createProjectMember(projectMemberData, t);
	});

	return response;
};

// 프로젝트 참여자 목록조회
export const getProjectMemberList = async (projectId) => {
	const response = await projectComponent.getProjectMemberList(projectId);

	return response;
};

// 프로젝트 참여자 수정
export const patchProjectMember = async (projectId, memberId, patchData) => {
	const projectMemberFilter = {
		project_id: projectId,
		member_id: memberId,
	};
	const response = await sequelize.transaction(async (t) => {
		await projectComponent.updateProjectMemberById(projectMemberFilter, patchData, t);
	});

	return response;
};

// 프로젝트 참여자 수정
export const deleteProjectMember = async (projectId, memberId) => {
	const projectMemberFilter = {
		project_id: projectId,
		member_id: memberId,
	};
	const response = await sequelize.transaction(async (t) => {
		await projectComponent.deleteProjectMember(projectMemberFilter, t);
	});

	return response;
};
