'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberLoginLog extends Model {
		static associate(models) {
			MemberLoginLog.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberLoginLog.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			login_ip: field(DataTypes.STRING(64), '로그인 IP', false, { defaultValue: '' }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: false,
			tableName: 'usr_member_login_log',
			comment: '일반회원 접속정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberLoginLog;
};
