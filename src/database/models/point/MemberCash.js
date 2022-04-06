'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberCash extends Model {
		static associate(models) {
			MemberCash.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberCash.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			type_cd: field(DataTypes.STRING(64), '포인트 출처(코드)'),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id'),
			job_id: field(DataTypes.BIGINT.UNSIGNED, 'jobs.id'),
			cash: field(DataTypes.INTEGER(16), '봉사시간'),
			payment_time: field(DataTypes.DATE, '지급 일시'),
			refund_status_cd: field(DataTypes.STRING(64), '환급 상태(코드)'),
			refund_time: field(DataTypes.DATE, '환급 일시'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_cash',
			comment: '일반회원 국가과제 지급정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberCash;
};
