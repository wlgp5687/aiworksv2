'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Task extends Model {
		static associate(models) {
			Task.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: false });
		}
	}

	Task.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id', false),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
			remain_cnt: field(DataTypes.INTEGER(8).UNSIGNED, '할당 카운트'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_task',
			comment: '일감 정보',
			sequelize,
		},
	);

	return Task;
};
