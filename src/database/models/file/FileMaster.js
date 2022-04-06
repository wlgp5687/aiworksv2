'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class FileMaster extends Model {
		static associate(models) {
			FileMaster.belongsTo(models.File, { as: 'file', foreignKey: 'id', sourceKey: 'file_id', constraints: false });
		}
	}

	FileMaster.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'id', false, { unique: true, primaryKey: true, autoIncrement: true }),
			file_id: field(DataTypes.BIGINT.UNSIGNED, 'files.id', false),
			file_key: field(DataTypes.STRING(128), '파일key', false),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'com_file_master',
			comment: '파일 마스터',
			indexes: [],
			sequelize,
		},
	);

	return FileMaster;
};
