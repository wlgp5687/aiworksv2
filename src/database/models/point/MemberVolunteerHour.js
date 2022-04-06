'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberVolunteerHour extends Model {
		static associate(models) {
			MemberVolunteerHour.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberVolunteerHour.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			type_cd: field(DataTypes.STRING(64), '포인트 출처(코드)'),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id'),
			job_id: field(DataTypes.BIGINT.UNSIGNED, 'jobs.id'),
			hour: field(DataTypes.INTEGER(16), '봉사시간'),
			payment_time: field(DataTypes.DATE, '지급 일시'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_volunteer_hour',
			comment: '일반회원 봉사시간정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberVolunteerHour;
};
