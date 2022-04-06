import { Sequelize } from 'sequelize';
import { getModel, Op } from '../../../database';

const Code = getModel('Code');
const Job = getModel('Job');
const Member = getModel('Member');
const Project = getModel('Project');
const MemberInfo = getModel('MemberInfo');
const JobData = getModel('JobData');
const ProjectJobConfig = getModel('ProjectJobConfig');

// 프로젝트 작업 목록 조회
export const getJobList = async (jobListSearchField, order, offset = 0, limit = 10) => {
	let response = null;
	const sql = {
		where: jobListSearchField.jobSearchFilter,
		distinct: true,
		include: [
			{
				model: Member,
				as: 'member',
				attributes: ['id', 'login_id', 'email'],
				where: jobListSearchField.memberFilter,
				required: true,
				include: [
					{
						model: MemberInfo,
						attributes: ['name'],
						where: jobListSearchField.memberInfoFilter,
						required: true,
					},
				],
			},
			{
				model: Project,
				as: 'project',
				attributes: ['id', 'project_code', 'name'],
				where: jobListSearchField.projectFilter,
				required: true,
			},
			{
				model: Code,
				as: 'jobStatus',
				attributes: ['id', 'code', 'code_name'],
				where: { code_type: 'assign' },
				required: false,
			},
		],
	};

	// Total
	const total = await Job.count(sql);

	if (total && total > 0) {
		sql.attributes = ['id', 'work_date', 'point'];
		sql.offset = parseInt(offset, 10);
		sql.limit = parseInt(limit, 10);
		sql.order = order;

		// 프로젝트 작업 목록 조회
		const jobListData = await Job.findAll(sql);
		if (Object.keys(jobListData).length > 0) response = { total, list: jobListData };
	}

	// Return
	return response;
};

// 작업 상세 조회
export const getJobByJobId = async (jobId) => {
	const response = await Job.findOne({
		include: [
			{ model: JobData, as: 'job_data', attributes: ['id', 'job_json'] },
			{ model: ProjectJobConfig, as: 'project_job_config', attributes: ['id', 'job_config_json'] },
		],
		where: { id: jobId },
	});
	return response;
};
