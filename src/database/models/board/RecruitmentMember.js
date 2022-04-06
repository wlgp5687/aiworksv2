'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class RecruitmentMember extends Model {
		static associate(models) {
			RecruitmentMember.belongsTo(models.Recruitment, { as: 'recruitment', foreignKey: 'recruitment_id', targetKey: 'id', constraints: false });
			RecruitmentMember.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	RecruitmentMember.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			recruitment_id: field(DataTypes.BIGINT.UNSIGNED, 'recruitments.id', false),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			personal_info_agreement: field(DataTypes.ENUM(IsBoolean.values()), '개인정보 동의여부', false, { defaultValue: IsBoolean.N.value }),
			sensitive_info_agreement: field(DataTypes.ENUM(IsBoolean.values()), '민감정보 동의여부', false, { defaultValue: IsBoolean.N.value }),
			recruitment_status_cd: field(DataTypes.STRING(64), '모집신청상태(코드)'),
			reply_title: field(DataTypes.STRING(256), '답변'),
			file_key: field(DataTypes.STRING(64), '파일'),
			withdrawal_date: field(DataTypes.DATE, '승인 거부일'),
			msg_reg_admin_id: field(DataTypes.BIGINT.UNSIGNED, '메세지등록 관리자'),
			msg: field(DataTypes.STRING(256), '메세지'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_recruitment_member',
			comment: '모집게시판 회원관리',
			indexes: [],
			sequelize,
		},
	);

	return RecruitmentMember;
};
