'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class TaskAssign extends Model {
		static associate(models) {
			TaskAssign.belongsTo(models.Task, { as: 'task', foreignKey: 'task_id', targetKey: 'id', constraints: false });
			TaskAssign.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	TaskAssign.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			task_id: field(DataTypes.BIGINT.UNSIGNED, 'tasks.id', false),
			worker_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			assign_status_cd: field(DataTypes.STRING(128), '할당 상태(코드)'),
			assigned_date: field(DataTypes.DATE, '할당시간'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_task_assign',
			comment: '일감 할당정보',
			indexes: [],
			sequelize,
		},
	);

	return TaskAssign;
};
