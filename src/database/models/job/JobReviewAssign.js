'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class JobReviewAssign extends Model {
		static associate(models) {
			JobReviewAssign.belongsTo(models.Job, { as: 'job', foreignKey: 'job_id', targetKey: 'id', constraints: false });
			JobReviewAssign.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	JobReviewAssign.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			job_id: field(DataTypes.BIGINT.UNSIGNED, 'jobs.id', false),
			reviewer_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			assign_status_cd: field(DataTypes.STRING(128), '할당 상태(코드)'),
			assigned_date: field(DataTypes.DATE, '할당시간'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_job_review_assign',
			comment: '작업 검수 할당정보',
			indexes: [],
			sequelize,
		},
	);

	return JobReviewAssign;
};
