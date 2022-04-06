import { Sequelize } from 'sequelize';
import { getModel } from '../../database';
import * as commonComponent from '../../components/common';

const ProjectJobConfig = getModel('ProjectJobConfig');
const ProjectJobConfigTmp = getModel('ProjectJobConfigTmp');
const JobData = getModel('JobData');
const Job = getModel('Job');

// 작업 저장
export const createJob = async (jobData, t) => {
	const response = await Job.create(jobData, { transaction: t });
	return response;
};

// 작업 결과값 저장
export const createJobData = async (jobJson, jobId, t) => {
	const jobJsonData = {
		job_id: jobId,
		job_json: jobJson,
	};
	const response = await JobData.create(jobJsonData, { transaction: t });
	return response;
};

// 작업 목록 조회
export const getJobListByProjectId = async (projectId) => {
	const response = await Job.findAll({ attributes: ['id', 'project_id', 'work_date', 'job_status_cd', 'point'] }, { where: { project_id: projectId } });
	return response;
};

// 작업 상세 조회
export const getJobByJobId = async (jobId) => {
	const response = await Job.findOne({
		include: [
			{ model: JobData, as: 'job_data', attributes: ['id', 'job_json'] },
			{ model: ProjectJobConfigTmp, as: 'project_job_config_tmp', attributes: ['id', 'job_config_json'] },
		],
		where: { id: jobId },
	});
	return response;
};
