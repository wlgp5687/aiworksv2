'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class ProjectContract extends Model {
		static associate(models) {
			ProjectContract.belongsTo(models.Project, { as: 'project', foreignKey: 'project_id', targetKey: 'id', constraints: false });
			ProjectContract.belongsTo(models.Member, { as: 'member', foreignKey: 'member_id', targetKey: 'id', constraints: false });
		}
	}

	ProjectContract.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_id: field(DataTypes.BIGINT.UNSIGNED, 'projects.id', false),
			member_id: field(DataTypes.BIGINT.UNSIGNED, 'members.id', false),
			contract_pdf_file_key: field(DataTypes.STRING(128), '계약서pdf 파일'),
			contract_date: field(DataTypes.DATE, '계약서 작성일자'),
			name: field(DataTypes.STRING(128), '이름'),
			address1: field(DataTypes.STRING(64), '주소1'),
			address2: field(DataTypes.STRING(64), '주소2'),
			phone: field(DataTypes.STRING(32), '핸드폰번호'),
			zip_code: field(DataTypes.STRING(16), '우편번호'),
			bank_cd: field(DataTypes.STRING(16), '은행(코드)'),
			account_name: field(DataTypes.STRING(64), '계좌주명'),
			account_num: field(DataTypes.STRING(64), '계좌번호'),
			book_copy_file_key: field(DataTypes.STRING(128), '통장사본 파일'),
			private_num1: field(DataTypes.STRING(64), '주민등록번호1'),
			private_num2: field(DataTypes.STRING(64), '주민등록번호2'),
			id_card_file_key: field(DataTypes.STRING(128), '주민등록증 파일'),
			sign_img_file_key: field(DataTypes.STRING(128), '서명이미지 파일'),
			etc_file_key: field(DataTypes.STRING(128), '기타 파일'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_project_contract',
			comment: '프로젝트 계약서',
			sequelize,
		},
	);

	return ProjectContract;
};
