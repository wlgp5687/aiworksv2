'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Qna extends Model {
		static associate(models) {
			Qna.belongsToMany(models.File, {
				as: 'file',
				through: models.FileMaster,
				foreignKey: 'file_key',
				otherKey: 'id',
				sourceKey: 'file_key',
			});
			Qna.hasOne(models.Code, { as: 'qna_category', foreignKey: 'code', sourceKey: 'qna_category_cd', constraints: false });
			Qna.hasOne(models.Code, { as: 'qna_status', foreignKey: 'code', sourceKey: 'qna_status_cd', constraints: false });
			Qna.hasOne(models.Code, { as: 'qna_type', foreignKey: 'code', sourceKey: 'qna_type_cd', constraints: false });
			Qna.hasOne(models.Member, { as: 'register', foreignKey: 'id', sourceKey: 'register_id', constraints: false });
		}
	}

	Qna.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			title: field(DataTypes.STRING(256), '제목'),
			content: field(DataTypes.TEXT, '내용'),
			qna_status_cd: field(DataTypes.STRING(64), '답변상태(코드)'),
			qna_category_cd: field(DataTypes.STRING(64), 'QNA카테고리(코드)'),
			qna_type_cd: field(DataTypes.STRING(64), 'QNA종류(코드)'),
			register_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
			is_public: field(DataTypes.ENUM(IsBoolean.values()), '공개여부', false, { defaultValue: IsBoolean.Y.value }),
			password: field(DataTypes.STRING(256), '작성비밀번호'),
			reply_title: field(DataTypes.STRING(256), '답변제목'),
			reply_content: field(DataTypes.TEXT, '답변내용'),
			reply_admin_id: field(DataTypes.BIGINT.UNSIGNED, 'admins.id'),
			reply_date: field(DataTypes.DATE, '답변날짜'),
			file_key: field(DataTypes.STRING(64), '파일'),
			hit: field(DataTypes.INTEGER(16), '조회수'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_qna',
			comment: 'QNA 게시판',
			sequelize,
		},
	);

	return Qna;
};
