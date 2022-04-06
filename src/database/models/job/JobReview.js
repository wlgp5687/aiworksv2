'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class JobReview extends Model {
		static associate(models) {
			JobReview.belongsTo(models.Job, { as: 'job', foreignKey: 'job_id', targetKey: 'id', constraints: false });
		}
	}

	JobReview.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			job_id: field(DataTypes.BIGINT.UNSIGNED, 'jobs.id', false),
			reviewer_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			review_result_cd: field(DataTypes.STRING(64), '검수 결과(코드)'),
			review_date: field(DataTypes.DATE, '검수일자'),
			review_message: field(DataTypes.BIGINT.UNSIGNED, '검수 메세지'),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_job_review',
			comment: '작업 검수정보',
			sequelize,
		},
	);

	return JobReview;
};
