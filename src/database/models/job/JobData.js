'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class JobData extends Model {
		static associate(models) {
			JobData.belongsTo(models.Job, { as: 'job', foreignKey: 'job_id', targetKey: 'id', constraints: false });
		}
	}

	JobData.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			job_id: field(DataTypes.BIGINT.UNSIGNED, 'job.id', false),
			job_json: field(DataTypes.JSON, '작업 데이터json'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_job_data',
			comment: '작업 데이터정보',
			sequelize,
		},
	);

	return JobData;
};
