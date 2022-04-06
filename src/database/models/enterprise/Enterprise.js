'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Enterprise extends Model {
		static associate(models) {
			this.hasOne(models.EnterpriseInfo, { foreignKey: 'enterprise_id', sourceKey: 'id' });
			this.hasOne(models.EnterpriseStatistic, { foreignKey: 'enterprise_id', sourceKey: 'id' });
		}
	}

	Enterprise.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			login_id: field(DataTypes.STRING(256), '아이디', false, { unique: true }),
			password: field(DataTypes.STRING(256), '비밀번호', false),
			email: field(DataTypes.STRING(256), '이메일'),
			last_login_at: field(DataTypes.DATE, '최종로그인'),
			login_fail_cnt: field(DataTypes.INTEGER(11).UNSIGNED, '로그인 실패횟수'),
			login_fail_date: field(DataTypes.DATE, '로그인 실패일시'),
			is_institute: field(DataTypes.ENUM(IsBoolean.values()), '기관여부', false, { defaultValue: IsBoolean.N.value }),
			is_approved: field(DataTypes.ENUM(IsBoolean.values()), '인증여부', false, { defaultValue: IsBoolean.N.value }),
			is_out: field(DataTypes.ENUM(IsBoolean.values()), '탈퇴여부', false, { defaultValue: IsBoolean.N.value }),
			is_blocked: field(DataTypes.ENUM(IsBoolean.values()), '블랙여부', false, { defaultValue: IsBoolean.N.value }),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_enterprise',
			comment: '기업회원 기본정보',
			sequelize,
		},
	);

	return Enterprise;
};
