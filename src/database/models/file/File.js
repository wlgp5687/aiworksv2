'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class File extends Model {
		static associate(models) {
			File.hasMany(models.FileMaster, { as: 'filemaster', foreignKey: 'file_id', sourceKey: 'id', constraints: false });
		}
	}

	File.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			name: field(DataTypes.STRING(255), '파일명'),
			file_path: field(DataTypes.STRING(255), '파일경로'),
			extension: field(DataTypes.STRING(255), '파일형식'),
			file_size: field(DataTypes.BIGINT.UNSIGNED, '파일크기'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'com_file',
			comment: '파일 정보',
			indexes: [],
			sequelize,
		},
	);

	return File;
};
