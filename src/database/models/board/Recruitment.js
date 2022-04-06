'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Recruitment extends Model {
		static associate(models) {
			Recruitment.hasOne(models.Code, { as: 'recruitment_type', foreignKey: 'code', sourceKey: 'recruitment_type_cd', constraints: false });
			Recruitment.hasOne(models.Code, { as: 'recruitment_status', foreignKey: 'code', sourceKey: 'recruitment_status_cd', constraints: false });
			Recruitment.belongsToMany(models.File, { as: 'file', through: models.FileMaster, foreignKey: 'file_key', otherKey: 'id', sourceKey: 'file_key', constraints: false });
		}
	}

	Recruitment.init(
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
			recruitment_status_cd: field(DataTypes.STRING(64), '모집상태(코드)'),
			recruitment_type_cd: field(DataTypes.STRING(64), '모집종류(코드)'),
			end_date: field(DataTypes.DATE, '모집 종료일'),
			is_deadline: field(DataTypes.ENUM(IsBoolean.values()), '종료일 지정여부', false, { defaultValue: IsBoolean.Y.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_recruitment',
			comment: '모집 게시판',
			sequelize,
		},
	);

	return Recruitment;
};
