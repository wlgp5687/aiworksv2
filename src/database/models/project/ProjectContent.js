'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ProjectContent extends Model {
		static associate(models) {
			ProjectContent.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: true });
		}
	}

	ProjectContent.init(
		// fields
		{
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'project.id', false, { unique: true, primaryKey: true, autoIncrement: false }),
			project_info: field(DataTypes.TEXT, '프로젝트 정보'),
			project_short_desc: field(DataTypes.TEXT, '프로젝트 간략설명'),
			project_detail_desc: field(DataTypes.TEXT, '프로젝트 세부설명'),
			project_example_desc: field(DataTypes.TEXT, '프로젝트 작업예제'),
			project_guide_desc: field(DataTypes.TEXT, '프로젝트 작업가이드'),
			project_guide_video: field(DataTypes.STRING(255), '작업가이드 비디오URL'),
			project_guide_file_key: field(DataTypes.STRING(128), '작업가이드 파일'),
			project_caution: field(DataTypes.TEXT, '프로젝트 주의사항'),
			contract_json: field(DataTypes.JSON, '프로젝트 계약사항'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_project_content',
			comment: '프로젝트 상세정보',
			sequelize,
		},
	);
	ProjectContent.removeAttribute('id');

	return ProjectContent;
};
