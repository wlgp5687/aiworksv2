'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Code extends Model {
		static associate(models) {
			Code.belongsTo(models.Event, { as: 'event', foreignKey: 'code', targetKey: 'event_status_cd', constraints: false });
		}
	}

	Code.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			order: field(DataTypes.BIGINT.UNSIGNED, '정렬'),
			code_type: field(DataTypes.STRING(128), '코드분류', false),
			up_code: field(DataTypes.STRING(128), '상위코드'),
			code: field(DataTypes.STRING(128), '코드명', false),
			code_name: field(DataTypes.STRING(128), '코드값'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'com_code',
			comment: '공통 코드',
			sequelize,
		},
	);

	return Code;
};
