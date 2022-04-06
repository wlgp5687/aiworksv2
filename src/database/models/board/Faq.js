'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Faq extends Model {
		static associate(models) {
			Faq.hasOne(models.Code, { as: 'faq_category', foreignKey: 'code', sourceKey: 'faq_category_cd', constraints: false });
		}
	}

	Faq.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			title: field(DataTypes.STRING(256), '제목'),
			content: field(DataTypes.TEXT, '내용'),
			admin_id: field(DataTypes.BIGINT.UNSIGNED, 'admins.id', false),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
			is_public: field(DataTypes.ENUM(IsBoolean.values()), '공개여부', false, { defaultValue: IsBoolean.Y.value }),
			faq_category_cd: field(DataTypes.STRING(64), 'FAQ카테고리(코드)'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_faq',
			comment: 'FAQ 게시판',
			sequelize,
		},
	);

	return Faq;
};
