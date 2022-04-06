import bcrypt from 'bcryptjs';
import { throwError } from '..';
import * as jobComponent from '../../components/job/job';
import * as commonComponent from '../../components/common';
import * as projectComponent from '../../components/project/project';
import { sequelize } from '../../database';

// 작업 저장
export const postJob = async (jobData) => {
	const nowDate = await commonComponent.nowDateTime();
	const jobConfig = await projectComponent.getProjectConfig(jobData.project_id);
	jobData.work_date = nowDate;
	jobData.job_config_id = jobConfig.dataValues.id;

	const jobResponse = await sequelize.transaction(async (t) => {
		return jobComponent.createJob(jobData, t);
	});

	// 작업 결과값 저장
	let response = null;
	if (jobResponse) {
		const jobId = jobResponse.dataValues.id;
		response = await sequelize.transaction(async (t) => {
			return jobComponent.createJobData(jobData.job_json, jobId, t);
		});
	}

	jobResponse.dataValues.job_json = response.dataValues.job_json;
	return jobResponse;
};

// 작업 목록 조회
export const getJobList = async (projectId) => {
	const response = await jobComponent.getJobListByProjectId(projectId);

	return response;
};

// 작업 상세 조회
export const getJobDetail = async (jobId) => {
	const response = await jobComponent.getJobByJobId(jobId);

	return response;
};
