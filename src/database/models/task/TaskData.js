'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class TaskData extends Model {
		static associate(models) {
			TaskData.belongsTo(models.Task, { as: 'task', foreignKey: 'task_id', targetKey: 'id', constraints: false });
		}
	}

	TaskData.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: false }),
			task_id: field(DataTypes.BIGINT.UNSIGNED, 'task.id', false),
			task_json: field(DataTypes.JSON, '일감 데이터json'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_task_data',
			comment: '일감 데이터정보',
			sequelize,
		},
	);

	return TaskData;
};
