'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberPointRefund extends Model {
		static associate(models) {
			MemberPointRefund.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberPointRefund.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			refund_status_cd: field(DataTypes.STRING(64), '포인트 환급상태(코드)'),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id'),
			point: field(DataTypes.INTEGER(16), '포인트'),
			refund_time: field(DataTypes.DATE, '환급 일시'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_point_refund',
			comment: '일반회원 포인트 환급정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberPointRefund;
};
