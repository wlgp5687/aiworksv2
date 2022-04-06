'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class EnterpriseStatistic extends Model {
		static associate(models) {
			EnterpriseStatistic.belongsTo(models.Enterprise, { as: 'enterprise', foreignKey: 'enterprise_id', targetKey: 'id', constraints: false });
		}
	}

	EnterpriseStatistic.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			enterprise_id: field(DataTypes.BIGINT.UNSIGNED, 'enterprises.id', false),
			enterprise_total_point: field(DataTypes.INTEGER(8), '총 포인트', false, { defaultValue: 0 }),
			enterprise_total_history_point: field(DataTypes.INTEGER(8), '총 누적 포인트', false, { defaultValue: 0 }),
			enterprise_total_login_cnt: field(DataTypes.INTEGER(8), '총 로그인 횟수', false, { defaultValue: 0 }),
			enterprise_total_project_cnt: field(DataTypes.INTEGER(8), '총 프로젝트 개설 횟수', false, { defaultValue: 0 }),
			enterprise_total_point_refund: field(DataTypes.INTEGER(8), '총 환급 포인트', false, { defaultValue: 0 }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_enterprise_statistic',
			comment: '기업회원 통계정보',
			indexes: [],
			sequelize,
		},
	);

	return EnterpriseStatistic;
};
