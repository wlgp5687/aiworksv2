'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberBlock extends Model {
		static associate(models) {
			MemberBlock.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
			MemberBlock.belongsTo(models.Admin, { as: 'admin', foreignKey: 'admin_id', targetKey: 'id', constraints: false });
		}
	}

	MemberBlock.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			admin_id: field(DataTypes.BIGINT.UNSIGNED, 'admins.id', false),
			blocked_at: field(DataTypes.DATE, '차단날짜'),
			comment: field(DataTypes.TEXT, '코멘트'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_block',
			comment: '차단회원 정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberBlock;
};
