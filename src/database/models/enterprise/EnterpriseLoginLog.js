'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class EnterpriseLoginLog extends Model {
		static associate(models) {
			EnterpriseLoginLog.belongsTo(models.Enterprise, { as: 'enterprise', foreignKey: 'enterprise_id', targetKey: 'id', constraints: false });
		}
	}

	EnterpriseLoginLog.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			enterprise_id: field(DataTypes.BIGINT.UNSIGNED, 'enterprises.id', false),
			login_ip: field(DataTypes.STRING(64), '로그인 IP', false, { defaultValue: '' }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'usr_enterprise_login_log',
			comment: '기업회원 접속정보',
			indexes: [],
			sequelize,
		},
	);

	return EnterpriseLoginLog;
};
