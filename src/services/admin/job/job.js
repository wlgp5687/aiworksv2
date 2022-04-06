import * as jobComponent from '../../../components/admin/job/job';
import * as commonComponent from '../../../components/common';
import { sequelize, Op } from '../../../database';

// 프로젝트 작업 목록 조회
export const getJobList = async (searchFields, offset = 0, limitParam = 10) => {
	// 최대 조회수 제한
	const limit = parseInt(limitParam, 10) > parseInt(process.env.PAGE_MAX_LIMIT, 10) ? process.env.PAGE_MAX_LIMIT : limitParam;
	const jobFilter = searchFields.job_filter ? searchFields.job_filter : null;
	const memberFilter = searchFields.member_filter ? searchFields.member_filter : null;
	const memberInfoFilter = searchFields.member_info_filter ? searchFields.member_info_filter : null;
	const projectFilter = searchFields.project_filter ? searchFields.project_filter : null;
	const common = searchFields.common ? searchFields.common : null;
	const order = [];
	let response = null;

	// 검색 조건
	const jobSearchFilter = {};
	if (jobFilter) {
		if (jobFilter.project_id) jobSearchFilter.project_id = jobFilter.project_id;
		if (jobFilter.job_status_cd) jobSearchFilter.job_status_cd = jobFilter.job_status_cd;
	}

	const memberSearchFilter = {};
	if (memberFilter) {
		if (memberFilter.member_id) memberSearchFilter.member_id = memberFilter.member_id;
		if (memberFilter.login_id) memberSearchFilter.login_id = { [Op.like]: `%${memberFilter.login_id}%` };
	}

	const memberInfoSearchFilter = {};
	if (memberInfoFilter) {
		if (memberInfoFilter.name) memberInfoSearchFilter.name = { [Op.like]: `%${memberInfoFilter.name}%` };
	}

	const projectSearchFilter = {};
	if (projectFilter) {
		if (projectFilter.project_code) projectSearchFilter.project_code = { [Op.like]: `%${projectFilter.project_code}%` };
		if (projectFilter.name) projectSearchFilter.name = { [Op.like]: `%${projectFilter.name}%` };
	}

	if (common && common.order) {
		if (common.order === 'last_at') order.push(['created_at', 'DESC'], ['id', 'DESC']);
		if (common.order === 'first_at') order.push(['created_at', 'ASC'], ['id', 'ASC']);
	}

	const jobListSearchField = {
		jobSearchFilter: jobSearchFilter,
		memberSearchFilter: memberSearchFilter,
		memberInfoSearchFilter: memberInfoSearchFilter,
		projectSearchFilter: projectSearchFilter,
	};

	response = await jobComponent.getJobList(jobListSearchField, order, offset, limit);

	return response;
};

// 작업 상세 조회
export const getJobDetail = async (jobId) => {
	const response = await jobComponent.getJobByJobId(jobId);

	return response;
};
