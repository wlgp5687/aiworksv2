'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberVolunteerRefund extends Model {
		static associate(models) {
			MemberVolunteerRefund.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberVolunteerRefund.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			refund_status_cd: field(DataTypes.STRING(64), '봉사시간 환급상태(코드)'),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id'),
			hour: field(DataTypes.INTEGER(16), '봉사시간'),
			refund_time: field(DataTypes.DATE, '환급 일시'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_volunteer_refund',
			comment: '일반회원 봉사시간 환급정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberVolunteerRefund;
};
