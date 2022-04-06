'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberExternal extends Model {
		static associate(models) {
			MemberExternal.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: true });
		}
	}

	MemberExternal.init(
		// fields
		{
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			join_type_cd: field(DataTypes.STRING(16), '연동 채널(코드)', false, { defaultValue: '' }),
			token: field(DataTypes.STRING(255), '연동토큰', false, { defaultValue: '' }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_external',
			comment: '일반회원 외부연동 정보',
			indexes: [
				{ unique: true, fields: ['member_id', 'join_type_cd'] },
				{ unique: true, fields: ['join_type_cd', 'token'] },
			],
			sequelize,
		},
	);
	MemberExternal.removeAttribute('id');

	return MemberExternal;
};
