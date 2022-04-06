'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Popup extends Model {}

	Popup.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			title: field(DataTypes.STRING(256), '제목'),
			comment: field(DataTypes.STRING(256), '설명'),
			content: field(DataTypes.TEXT, '내용'),
			admin_id: field(DataTypes.BIGINT.UNSIGNED, 'admins.id', false),
			start_date: field(DataTypes.DATE, '팝업시작일'),
			end_date: field(DataTypes.DATE, '팝업종료일'),
			width: field(DataTypes.INTEGER(8), '너비'),
			height: field(DataTypes.INTEGER(8), '높이'),
			position_x: field(DataTypes.INTEGER(8), 'x좌표'),
			position_y: field(DataTypes.INTEGER(8), 'y좌표'),
			expired_time: field(DataTypes.INTEGER(16), '노출시간'),
			is_use: field(DataTypes.ENUM(IsBoolean.values()), '사용여부', false, { defaultValue: IsBoolean.N.value }),
			is_window: field(DataTypes.ENUM(IsBoolean.values()), '새창여부', false, { defaultValue: IsBoolean.N.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'brd_popup',
			comment: '팝업',
			sequelize,
		},
	);

	return Popup;
};
