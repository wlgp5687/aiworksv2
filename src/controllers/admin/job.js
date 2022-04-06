import * as jobService from '../../services/admin/job/job';
import * as commonComponent from '../../components/common';

// 프로젝트 작업 목록 조회
export const getJobList = async (req) => {
	const page = req.query.page ? req.query.page : 1;
	const limit = req.query.limit ? req.query.limit : process.env.PAGE_LIMIT;
	const offset = await commonComponent.getOffset(page, limit);
	const searchFields = {};
	// 검색 필터
	const jobFilter = {};
	if (req.query.project_id) jobFilter.project_id = req.query.project_id;
	if (req.query.job_status_cd) jobFilter.job_status_cd = req.query.job_status_cd;
	if (Object.keys(jobFilter).length > 0) searchFields.job_filter = jobFilter;

	const memberFilter = {};
	if (req.query.member_id) memberFilter.member_id = req.query.member_id;
	if (req.query.member_name) memberFilter.name = req.query.member_name;
	if (req.query.login_id) memberFilter.login_id = req.query.login_id;
	if (Object.keys(memberFilter).length > 0) searchFields.member_filter = memberFilter;

	const memberInfoFilter = {};
	if (req.query.name) memberInfoFilter.name = req.query.name;
	if (Object.keys(memberInfoFilter).length > 0) searchFields.member_info_filter = memberInfoFilter;

	const projectFilter = {};
	if (req.query.project_code) projectFilter.project_code = req.query.project_code;
	if (req.query.project_name) projectFilter.name = req.query.project_name;
	if (Object.keys(projectFilter).length > 0) searchFields.project_filter = projectFilter;

	const jobList = await jobService.getJobList(searchFields, offset, limit);
	// Return
	return jobList ? { job_list: jobList } : null;
};

// 작업 상세 조회
export const getJobDetail = async (req) => {
	const jobId = req.params.job_id;

	const response = await jobService.getJobDetail(jobId);

	return response;
};
