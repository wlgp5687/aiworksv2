'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class AdminLoginLog extends Model {
		static associate(models) {
			AdminLoginLog.belongsTo(models.Admin, { as: 'admin', foreignKey: 'admin_id', targetKey: 'id', constraints: false });
		}
	}

	AdminLoginLog.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			admin_id: field(DataTypes.BIGINT.UNSIGNED, 'admins.id', false),
			login_ip: field(DataTypes.STRING(64), '로그인 IP', false, { defaultValue: '' }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'usr_admin_login_log',
			comment: '관리자 접속정보',
			indexes: [],
			sequelize,
		},
	);

	return AdminLoginLog;
};
