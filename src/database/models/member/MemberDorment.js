'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberDorment extends Model {
		static associate(models) {
			MemberDorment.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberDorment.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			dorment_at: field(DataTypes.DATE, '휴면날짜'),
			comment: field(DataTypes.TEXT, '코멘트'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_dorment',
			comment: '휴면회원 정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberDorment;
};
