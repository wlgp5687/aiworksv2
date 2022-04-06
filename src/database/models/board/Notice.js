'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Notice extends Model {
		static associate(models) {
			Notice.belongsToMany(models.File, { as: 'file', through: models.FileMaster, foreignKey: 'file_key', otherKey: 'id', sourceKey: 'file_key', constraints: false });
		}
	}

	Notice.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			title: field(DataTypes.STRING(256), '제목'),
			content: field(DataTypes.TEXT, '내용'),
			admin_id: field(DataTypes.BIGINT.UNSIGNED, 'admins.id', false),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
			is_public: field(DataTypes.ENUM(IsBoolean.values()), '공개여부', false, { defaultValue: IsBoolean.Y.value }),
			file_key: field(DataTypes.STRING(64), '파일'),
			hit: field(DataTypes.INTEGER(16), '조회수'),
			is_home: field(DataTypes.ENUM(IsBoolean.values()), '홈화면 노출여부', false, { defaultValue: IsBoolean.N.value }),
			short_desc: field(DataTypes.TEXT, '간략설명'),
			another_url: field(DataTypes.STRING(256), '이동URL'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_notice',
			comment: '공지사항',
			sequelize,
		},
	);

	return Notice;
};
