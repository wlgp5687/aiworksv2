'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ProjectMember extends Model {
		static associate(models) {
			ProjectMember.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: false });
			ProjectMember.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	ProjectMember.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id', false),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			is_approved: field(DataTypes.ENUM(IsBoolean.values()), '인증여부', false, { defaultValue: IsBoolean.N.value }),
			project_role_cd: field(DataTypes.STRING(128), '프로젝트 역할(코드)'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_project_member',
			comment: '프로젝트 회원정보',
			indexes: [],
			sequelize,
		},
	);

	return ProjectMember;
};
