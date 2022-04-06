import * as jobService from '../services/job/job';

// 작업 완료
export const postJob = async (req) => {
	const jobData = {
		project_id: req.body.project_id,
		worker_id: req.body.worker_id,
		job_json: req.body.job_data,
	};

	const response = await jobService.postJob(jobData);

	return response;
};

// 작업 목록 조회
export const getJobList = async (req) => {
	const projectId = req.body.project_id;
	const memberId = req.body.member_id ? req.body.member_id : null;

	const response = await jobService.getJobList(projectId);

	return response;
};

// 작업 상세 조회
export const getJobDetail = async (req) => {
	const jobId = req.params.job_id;

	const response = await jobService.getJobDetail(jobId);

	return response;
};
