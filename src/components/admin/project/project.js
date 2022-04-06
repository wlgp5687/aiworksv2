import { getModel } from '../../../database';

const ProjectJobConfig = getModel('ProjectJobConfig');
const Project = getModel('Project');
const ProjectContent = getModel('ProjectContent');
const ProjectMember = getModel('ProjectMember');
const MemberInfo = getModel('MemberInfo');
const Member = getModel('Member');
const Code = getModel('Code');

// 프로젝트 생성
export const createProject = async (projectData, t) => {
	const response = await Project.create(projectData, { transaction: t });
	return response;
};

// 프로젝트 상세내용 생성
export const createProjectContentById = async (projectInfoData, t) => {
	const response = await ProjectContent.create(projectInfoData, { transaction: t });
	return response;
};

// 프로젝트 작업 형식 생성
export const createProjectConfigById = async (configData, t) => {
	const response = await ProjectJobConfig.create(configData, { transaction: t });
	return response;
};

// 프로젝트 기본 수정
export const updateProjectById = async (projectId, projectData, t) => {
	const response = await Project.update(projectData, { where: { id: projectId }, transaction: t });

	return response;
};

// 프로젝트 상세내용 수정
export const updateProjectContentById = async (projectId, projectContent, t) => {
	const response = await ProjectContent.update(projectContent, { where: { project_id: projectId }, transaction: t });

	return response;
};

// 프로젝트 작업 형식 수정
export const updateProjectConfigById = async (projectId, projectConfig, t) => {
	const response = await ProjectJobConfig.update({ job_config_json: projectConfig }, { where: { project_id: projectId }, transaction: t });

	return response;
};

// 프로젝트 Id로 형식버전 조회
export const getConfigByProjectId = async (projectId) => {
	const response = await ProjectJobConfig.findOne({
		where: { project_id: projectId },
		order: [['version', 'DESC']],
	});

	return response;
};

// 프로젝트 상세조회
export const getProjectDetailById = async (projectId) => {
	const response = await Project.findOne({
		where: { id: projectId },
		include: [
			{
				model: ProjectContent,
			},
		],
	});

	return response;
};

// 프로젝트 목록조회
export const getProjectList = async (projectAttr, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: projectAttr,
		distinct: true,
	};

	// Total
	const total = await Project.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'name', 'start_date', 'end_date', 'is_deleted', 'is_secret', 'is_volunteer'];
		sql.include = [
			{
				model: Code,
				as: 'projectType',
				attributes: ['id', 'code', 'code_name'],
				where: { code_type: 'project_type' },
				required: false,
			},
			{
				model: Code,
				as: 'projectCategory',
				attributes: ['id', 'code', 'code_name'],
				where: { code_type: 'project_category' },
				required: false,
			},
			{
				model: Code,
				as: 'projectStatus',
				attributes: ['id', 'code', 'code_name'],
				where: { code_type: 'project_status' },
				required: false,
			},
		];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 프로젝트 정보 조회
		const projectData = await Project.findAll(sql);
		if (Object.keys(projectData).length > 0) response = { total, list: projectData };
	}

	// Return
	return response;
};

// 프로젝트 참여자 등록
export const createProjectMember = async (projectMemberData, t) => {
	const response = await ProjectMember.bulkCreate(projectMemberData, { transaction: t });

	return response;
};

// 프로젝트 참여자 목록조회
export const getProjectMemberList = async (projectId) => {
	const response = await ProjectMember.findAll({
		include: [
			{
				model: Member,
				attributes: ['login_id', 'email'],
				include: [
					{
						model: MemberInfo,
						attributes: ['name'],
					},
				],
			},
		],
		where: { project_id: projectId },
	});

	return response;
};

// 프로젝트 참여자 수정
export const updateProjectMemberById = async (projectMemberFilter, patchData, t) => {
	await ProjectMember.update(patchData, { where: projectMemberFilter, transaction: t });

	return null;
};

// 프로젝트 참여자 삭제
export const deleteProjectMember = async (projectMemberFilter, t) => {
	await ProjectMember.destroy({
		where: projectMemberFilter,
		transaction: t,
	});

	return null;
};
