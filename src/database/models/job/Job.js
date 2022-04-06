'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Job extends Model {
		static associate(models) {
			Job.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: false });
			Job.belongsTo(models.Member, { as: 'member', foreignKey: 'worker_id', targetKey: 'id', constraints: false });
			Job.belongsTo(models.ProjectJobConfig, { as: 'project_job_config', foreignKey: 'job_config_id', targetKey: 'id', constraints: false });
			Job.hasOne(models.JobData, { as: 'job_data', foreignKey: 'job_id', sourceKey: 'id', constraints: false });
			Job.hasOne(models.Code, { as: 'jobStatus', foreignKey: 'code', sourceKey: 'job_status_cd', constraints: false });
		}
	}

	Job.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id', false),
			job_config_id: field(DataTypes.BIGINT.UNSIGNED, 'projectjobconfigs.id', false),
			worker_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			work_date: field(DataTypes.DATE, '작업일자'),
			task_id: field(DataTypes.BIGINT.UNSIGNED, 'tasks.id'),
			job_status_cd: field(DataTypes.STRING(64), '작업 상태(코드)'),
			point: field(DataTypes.BIGINT.UNSIGNED, '지급포인트'),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_job',
			comment: '작업 정보',
			sequelize,
		},
	);

	return Job;
};
