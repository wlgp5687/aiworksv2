'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class MemberPolicy extends Model {
		static associate(models) {
			MemberPolicy.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	MemberPolicy.init(
		// fields
		{
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false, { unique: true, primaryKey: true, autoIncrement: false }),
			service_agreement: field(DataTypes.ENUM(IsBoolean.values()), '서비스 약관동의', false, { defaultValue: IsBoolean.N.value }),
			service_agreement_date: field(DataTypes.DATE, '서비스 약관동의일'),
			private_agreement: field(DataTypes.ENUM(IsBoolean.values()), '개인정보 수집 및 이용동의', false, { defaultValue: IsBoolean.N.value }),
			private_agreement_date: field(DataTypes.DATE, '개인정보 수집 및 이용동의일'),
			promotion_agreement: field(DataTypes.ENUM(IsBoolean.values()), '이벤트 정보 수신동의', false, { defaultValue: IsBoolean.N.value }),
			promotion_agreement_date: field(DataTypes.DATE, '이벤트 정보 수신동의일'),
			age_restrict_agreement: field(DataTypes.ENUM(IsBoolean.values()), '가입나이 제한 동의', false, { defaultValue: IsBoolean.N.value }),
			age_restrict_agreement_date: field(DataTypes.DATE, '가입나이 제한 동의일'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_member_policy',
			comment: '회원정책 동의정보',
			indexes: [],
			sequelize,
		},
	);

	return MemberPolicy;
};
