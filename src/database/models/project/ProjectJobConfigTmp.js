'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ProjectJobConfigTmp extends Model {
		static associate(models) {
			ProjectJobConfigTmp.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: false });
			ProjectJobConfigTmp.hasMany(models.Job, { as: 'job', foreignKey: 'job_config_id', sourceKey: 'id', constraints: false });
		}
	}

	ProjectJobConfigTmp.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'project.id', false),
			job_config_json: field(DataTypes.JSON, '프로젝트 형식json'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_project_job_config_tmp',
			comment: '프로젝트 작업형식 임시',
			sequelize,
		},
	);

	return ProjectJobConfigTmp;
};
