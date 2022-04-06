'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberInfo extends Model {
		static associate(models) {
			MemberInfo.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
			MemberInfo.hasOne(models.Code, { as: 'gender', foreignKey: 'code', sourceKey: 'gender_cd', constraints: false });
			MemberInfo.hasOne(models.Code, { as: 'age', foreignKey: 'code', sourceKey: 'age_cd', constraints: false });
			MemberInfo.hasOne(models.Code, { as: 'region', foreignKey: 'code', sourceKey: 'region_cd', constraints: false });
		}
	}

	MemberInfo.init(
		// fields
		{
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id(PK/FK)', false, { unique: true, primaryKey: true, autoIncrement: false }),
			name: field(DataTypes.STRING(128), '이름'),
			birthday: field(DataTypes.DATE, '생년월일'),
			gender_cd: field(DataTypes.STRING(16), '성별(코드)'),
			age_cd: field(DataTypes.STRING(16), '나이(코드)'),
			region_cd: field(DataTypes.STRING(16), '지역(코드)'),
			phone: field(DataTypes.STRING(32), '핸드폰번호'),
			zip_code: field(DataTypes.STRING(16), '우편번호'),
			address1: field(DataTypes.STRING(64), '주소1'),
			address2: field(DataTypes.STRING(64), '주소2'),
			is_sms: field(DataTypes.ENUM(IsBoolean.values()), 'sms 수신여부', false, { defaultValue: IsBoolean.N.value }),
			is_email: field(DataTypes.ENUM(IsBoolean.values()), '이메일 수신여부', false, { defaultValue: IsBoolean.N.value }),
			thumbnail_file_key: field(DataTypes.STRING(64), '썸네일'),
			my_referral_code: field(DataTypes.STRING(16), '내 추천인코드'),
			bank_cd: field(DataTypes.STRING(16), '은행(코드)'),
			account_name: field(DataTypes.STRING(64), '계좌주명'),
			account_num: field(DataTypes.STRING(64), '계좌번호'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_info',
			comment: '일반회원 상세정보',
			sequelize,
		},
	);
	MemberInfo.removeAttribute('id');

	return MemberInfo;
};
