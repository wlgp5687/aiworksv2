'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class EnterpriseMember extends Model {
		static associate(models) {
			EnterpriseMember.belongsTo(models.Enterprise, { as: 'enterprise', foreignKey: 'enterprise_id', targetKey: 'id', constraints: false });
			EnterpriseMember.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	EnterpriseMember.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			enterprise_id: field(DataTypes.BIGINT.UNSIGNED, 'enterprises.id', false),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			is_manager: field(DataTypes.ENUM(IsBoolean.values()), '매니저여부', false, { defaultValue: IsBoolean.N.value }),
			is_approved: field(DataTypes.ENUM(IsBoolean.values()), '인증여부', false, { defaultValue: IsBoolean.N.value }),
			approve_code: field(DataTypes.STRING(16), '인증코드'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_enterprise_member',
			comment: '기업회원 관리',
			indexes: [],
			sequelize,
		},
	);

	return EnterpriseMember;
};
