import * as projectService from '../../services/admin/project/project';
import * as commonComponent from '../../components/common';

// 프로젝트 생성
export const createProject = async (req) => {
	const projectData = {
		enterprise_id: req.body.enterprise_id,
		project_type_cd: req.body.project_type_cd,
		project_category_cd: req.body.project_category_cd,
		project_status_cd: 'STA1',
		name: req.body.name,
		is_secret: req.body.is_secret ? req.body.is_secret : 'N',
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		is_volunteer: req.body.is_volunteer ? req.body.is_volunteer : 'N',
		is_homework: req.body.is_homework ? req.body.is_homework : 'N',
		is_app: req.body.is_app ? req.body.is_app : 'N',
		is_active_rrn: req.body.is_active_rrn ? req.body.is_active_rrn : 'N',
		is_active_address: req.body.is_active_address ? req.body.is_active_address : 'N',
		is_active_bank: req.body.is_active_bank ? req.body.is_active_bank : 'N',
		total_task_cnt: req.body.total_task_cnt ? req.body.total_task_cnt : 0,
		point_per_task: req.body.point_per_task ? req.body.point_per_task : 0,
		max_user_cnt: req.body.max_user_cnt ? req.body.max_user_cnt : 0,
		user_max_task_cnt: req.body.user_max_task_cnt ? req.body.user_max_task_cnt : 0,
		voluntary_hour_per_task: req.body.voluntary_hour_per_task ? req.body.voluntary_hour_per_task : 0,
		user_voluntary_hour: req.body.user_voluntary_hour ? req.body.user_voluntary_hour : 0,
		additional_task_cnt: req.body.additional_task_cnt ? req.body.additional_task_cnt : 0,
		sumpayment_point: req.body.sumpayment_point ? req.body.sumpayment_point : 0,
		sumpayment_task_cnt: req.body.sumpayment_task_cnt ? req.body.sumpayment_task_cnt : 0,
	};

	const projectContent = {
		project_info: req.body.project_info ? req.body.project_info : null,
		project_short_desc: req.body.project_short_desc ? req.body.project_short_desc : null,
		project_detail_desc: req.body.project_detail_desc ? req.body.project_detail_desc : null,
		project_example_desc: req.body.project_example_desc ? req.body.project_example_desc : null,
		project_guide_desc: req.body.project_guide_desc ? req.body.project_guide_desc : null,
		project_guide_video: req.body.project_guide_video ? req.body.project_guide_video : null,
		project_guide_file_key: req.body.project_guide_file_key ? req.body.project_guide_file_key : null,
		project_caution: req.body.project_caution ? req.body.project_caution : null,
	};

	const projectConfig = req.body.project_config;

	const response = await projectService.createProject(projectData, projectContent, projectConfig);

	return response;
};

// 프로젝트 수정
export const patchProject = async (req) => {
	const projectId = req.params.project_id;
	const projectData = {
		enterprise_id: req.body.enterprise_id,
		project_type_cd: req.body.project_type_cd,
		project_category_cd: req.body.project_category_cd,
		name: req.body.name,
		is_secret: req.body.is_secret,
		is_volunteer: req.body.is_volunteer,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		is_homework: req.body.is_homework,
		is_app: req.body.is_app,
		is_active_rrn: req.body.is_active_rrn,
		is_active_address: req.body.is_active_address,
		is_active_bank: req.body.is_active_bank,
		total_task_cnt: req.body.total_task_cnt,
		point_per_task: req.body.point_per_task,
		max_user_cnt: req.body.max_user_cnt,
		user_max_task_cnt: req.body.user_max_task_cnt,
		voluntary_hour_per_task: req.body.voluntary_hour_per_task,
		user_voluntary_hour: req.body.user_voluntary_hour,
		additional_task_cnt: req.body.additional_task_cnt,
		sumpayment_point: req.body.sumpayment_point,
		sumpayment_task_cnt: req.body.sumpayment_task_cnt,
	};

	const projectContent = {
		project_info: req.body.project_info,
		project_short_desc: req.body.project_short_desc,
		project_detail_desc: req.body.project_detail_desc,
		project_example_desc: req.body.project_example_desc,
		project_guide_desc: req.body.project_guide_desc,
		project_guide_video: req.body.project_guide_video,
		project_guide_file_key: req.body.project_guide_file_key,
		project_caution: req.body.project_caution,
	};

	const projectConfig = req.body.project_config;

	const response = await projectService.patchProject(projectId, projectData, projectContent, projectConfig);

	return response;
};

// 프로젝트 상세 조회
export const getProjectDetail = async (req) => {
	const projectId = req.params.project_id;

	const response = await projectService.getProjectDetail(projectId);

	return response;
};

// 프로젝트 목록 조회
export const getProjectList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};

	// 검색 필터
	const projectInfo = {};
	if (req.query.is_deleted) projectInfo.is_deleted = req.query.is_deleted;
	if (req.query.project_type_cd) projectInfo.project_type_cd = req.query.project_type_cd;
	if (req.query.project_code) projectInfo.project_code = req.query.project_code;
	if (req.query.project_category_cd) projectInfo.project_category_cd = req.query.project_category_cd;
	if (req.query.name) projectInfo.name = req.query.name;
	if (req.query.is_secret) projectInfo.is_secret = req.query.is_secret;
	if (req.query.is_volunteer) projectInfo.is_volunteer = req.query.is_volunteer;
	if (req.query.start_date) projectInfo.start_date = req.query.start_date;
	if (req.query.end_date) projectInfo.end_date = req.query.end_date;
	if (Object.keys(projectInfo).length > 0) searchFields.project_info = projectInfo;

	const common = {};
	if (req.query.order) common.order = req.query.order;
	if (Object.keys(common).length > 0) searchFields.common = common;

	// 프로젝트 목록 조회
	const projects = await projectService.getProjectList(searchFields, offset, limit);
	// Return
	return !projects ? null : { ...projects, limit: parseInt(limit, 10), page: parseInt(page, 10) };
};

// 프로젝트 형식 조회
export const getProjectConfig = async (req) => {
	const projectId = req.params.project_id;

	const response = await projectService.getProjectConfig(projectId);

	return response.job_config_json;
};

// 프로젝트 삭제
export const deleteProject = async (req) => {
	const projectId = req.params.project_id;
	const projectData = {
		is_deleted: 'Y',
	};

	const response = await projectService.deleteProject(projectId, projectData);

	return response;
};

// 프로젝트 참여자 등록
export const postProjectMembers = async (req) => {
	const projectId = req.body.project_id;
	const memberList = req.body.member_list;

	const response = await projectService.postProjectMember(projectId, memberList);

	return response;
};

// 프로젝트 참여자 목록조회
export const getProjectMemberList = async (req) => {
	const projectId = req.params.project_id;

	const response = await projectService.getProjectMemberList(projectId);

	return response;
};

// 프로젝트 참여자 수정
export const patchProjectMember = async (req) => {
	const projectId = req.params.project_id;
	const memberId = req.params.member_id;
	const patchData = {
		is_approved: req.body.is_approved,
		role_cd: req.body.role_cd,
	};

	const response = await projectService.patchProjectMember(projectId, memberId, patchData);

	return response;
};

// 프로젝트 참여자 삭제
export const deleteProjectMember = async (req) => {
	const projectId = req.params.project_id;
	const memberId = req.params.member_id;
	const response = await projectService.deleteProjectMember(projectId, memberId);

	return response;
};
