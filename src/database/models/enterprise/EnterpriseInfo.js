'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class EnterpriseInfo extends Model {
		static associate(models) {
			EnterpriseInfo.belongsTo(models.Enterprise, { as: 'enterprise', foreignKey: 'enterprise_id', targetKey: 'id', constraints: false });
		}
	}

	EnterpriseInfo.init(
		// fields
		{
			enterprise_id: field(DataTypes.BIGINT.UNSIGNED, 'enterprises.id(PK/FK)', false, { unique: true, primaryKey: true, autoIncrement: false }),
			name: field(DataTypes.STRING(128), '이름'),
			phone: field(DataTypes.STRING(32), '대표번호'),
			zip_code: field(DataTypes.STRING(16), '우편번호'),
			address1: field(DataTypes.STRING(64), '주소1'),
			address2: field(DataTypes.STRING(64), '주소2'),
			company_reg_file_key: field(DataTypes.STRING(64), '사업자등록증'),
			company_reg_num: field(DataTypes.STRING(64), '사업자등록번호'),
			thumbnail_file_key: field(DataTypes.STRING(64), '썸네일'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'usr_enterprise_info',
			comment: '기업회원 상세정보',
			sequelize,
		},
	);
	EnterpriseInfo.removeAttribute('id');

	return EnterpriseInfo;
};
