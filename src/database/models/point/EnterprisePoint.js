'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class EnterprisePoint extends Model {
		static associate(models) {
			EnterprisePoint.belongsTo(models.Enterprise, { as: 'enterprise', foreignKey: 'enterprise_id', targetKey: 'id', constraints: false });
		}
	}

	EnterprisePoint.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			type_cd: field(DataTypes.STRING(64), '포인트 출처(코드)'),
			enterprise_id: field(DataTypes.BIGINT.UNSIGNED, 'enterprises.id', false),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id'),
			point: field(DataTypes.INTEGER(16), '포인트'),
			payment_time: field(DataTypes.DATE, '지급 일시'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_enterprise_point',
			comment: '기업회원 포인트정보',
			indexes: [],
			sequelize,
		},
	);

	return EnterprisePoint;
};
