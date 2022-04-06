import * as projectService from '../services/project/project';

// 프로젝트 설정 저장
export const patchProject = async (req) => {
	const projectId = req.params.project_id;
	const response = await projectService.patchProject(projectId);

	return response;
};

// 프로젝트 형식 저장 (임시)
export const postProjectConfig = async (req) => {
	const configData = {
		project_id: req.body.project_id,
		job_config_json: req.body.config,
	};

	const response = await projectService.postProjectConfig(configData);

	return response;
};

// 프로젝트 형식 조회
export const getProjectConfig = async (req) => {
	const projectId = req.params.project_id;

	const response = await projectService.getProjectConfig(projectId);

	return response.job_config_json;
};

// 프로젝트 형식 수정
export const patchProjectConfig = async (req) => {
	const configData = {
		project_id: req.params.project_id,
		job_config_json: req.body.config,
	};

	await projectService.patchProjectConfig(configData);

	return null;
};
