'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ProjectJobConfig extends Model {
		static associate(models) {
			ProjectJobConfig.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: false });
			ProjectJobConfig.hasMany(models.Job, { as: 'job', foreignKey: 'job_config_id', sourceKey: 'id', constraints: false });
		}
	}

	ProjectJobConfig.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'project.id', false),
			version: field(DataTypes.BIGINT.UNSIGNED, '버전'),
			job_config_json: field(DataTypes.JSON, '프로젝트 형식json'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_project_job_config',
			comment: '프로젝트 작업형식',
			sequelize,
		},
	);

	return ProjectJobConfig;
};
