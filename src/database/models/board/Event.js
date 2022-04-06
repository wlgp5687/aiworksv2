'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Event extends Model {
		static associate(models) {
			Event.hasOne(models.Code, { as: 'event_status', foreignKey: 'code', sourceKey: 'event_status_cd', constraints: false });
			Event.belongsToMany(models.File, { as: 'file', through: models.FileMaster, foreignKey: 'file_key', otherKey: 'id', sourceKey: 'file_key', constraints: false });
		}
	}

	Event.init(
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
			event_status_cd: field(DataTypes.STRING(64), '이벤트상태(코드)'),
			start_date: field(DataTypes.DATE, '이벤트 시작일'),
			end_date: field(DataTypes.DATE, '이벤트 종료일'),
			short_desc: field(DataTypes.TEXT, '간략설명'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_event',
			comment: '이벤트 게시판',
			sequelize,
		},
	);

	return Event;
};
