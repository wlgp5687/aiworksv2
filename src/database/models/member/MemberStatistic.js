'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberStatistic extends Model {
		static associate(models) {
			MemberStatistic.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberStatistic.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			member_total_point: field(DataTypes.INTEGER(8), '총 포인트', false, { defaultValue: 0 }),
			member_total_history_point: field(DataTypes.INTEGER(8), '총 누적 포인트', false, { defaultValue: 0 }),
			member_total_volunteer: field(DataTypes.INTEGER(8), '총 봉사시간', false, { defaultValue: 0 }),
			member_total_cash: field(DataTypes.INTEGER(8), '총 국가과제 지급', false, { defaultValue: 0 }),
			member_total_login_cnt: field(DataTypes.INTEGER(8), '총 로그인 횟수', false, { defaultValue: 0 }),
			member_total_task_cnt: field(DataTypes.INTEGER(8), '총 작업 횟수', false, { defaultValue: 0 }),
			member_total_review_cnt: field(DataTypes.INTEGER(8), '총 검수 횟수', false, { defaultValue: 0 }),
			member_total_task_confirm_cnt: field(DataTypes.INTEGER(8), '총 작업 검수완료 횟수', false, { defaultValue: 0 }),
			member_total_project_cnt: field(DataTypes.INTEGER(8), '총 프로젝트 참여 횟수', false, { defaultValue: 0 }),
			member_total_point_refund: field(DataTypes.INTEGER(8), '총 환급 포인트', false, { defaultValue: 0 }),
			member_total_volunteer_refund: field(DataTypes.INTEGER(8), '총 환급 봉사시간', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_statistic',
			comment: '일반회원 통계정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberStatistic;
};
