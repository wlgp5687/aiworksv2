'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Admin extends Model {}

	Admin.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			login_id: field(DataTypes.STRING(256), '아이디', false, { unique: true }),
			password: field(DataTypes.STRING(256), '비밀번호', false),
			name: field(DataTypes.STRING(256), '이름', false),
			email: field(DataTypes.STRING(256), '이메일'),
			last_login_at: field(DataTypes.DATE, '최종로그인'),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_admin',
			comment: '관리자 기본정보',
			sequelize,
		},
	);

	return Admin;
};
