'use strict'; // eslint-disable-line strict, lines-around-directive

import { Model } from 'sequelize';
import { IsBoolean } from '../../enum';
import { field } from '../..';

export default (sequelize, DataTypes) => {
	class Project extends Model {
		static associate(models) {
			Project.hasOne(models.ProjectContent, { foreignKey: 'project_id', sourceKey: 'id' });
			Project.hasMany(models.ProjectJobConfig, { foreignKey: 'project_id', sourceKey: 'id' });
			Project.hasOne(models.Code, { as: 'projectType', foreignKey: 'code', sourceKey: 'project_type_cd', constraints: false });
			Project.hasOne(models.Code, { as: 'projectCategory', foreignKey: 'code', sourceKey: 'project_category_cd', constraints: false });
			Project.hasOne(models.Code, { as: 'projectStatus', foreignKey: 'code', sourceKey: 'project_status_cd', constraints: false });
		}
	}

	Project.init(
		// fields
		{
			id: field(DataTypes.BIGINT.UNSIGNED, 'PK', false, { unique: true, primaryKey: true, autoIncrement: true }),
			project_code: field(DataTypes.STRING(16), '프로젝트 코드', false, { unique: true }),
			enterprise_id: field(DataTypes.BIGINT.UNSIGNED, 'enterprises.id', false),
			project_type_cd: field(DataTypes.STRING(64), '프로젝트 타입(코드)'),
			project_category_cd: field(DataTypes.STRING(64), '프로젝트 카테고리(코드)'),
			project_status_cd: field(DataTypes.STRING(64), '프로젝트 상태(코드)'),
			name: field(DataTypes.STRING(255), '프로젝트명'),
			is_secret: field(DataTypes.ENUM(IsBoolean.values()), '공개여부', false, { defaultValue: IsBoolean.Y.value }),
			is_deleted: field(DataTypes.ENUM(IsBoolean.values()), '삭제여부', false, { defaultValue: IsBoolean.N.value }),
			is_volunteer: field(DataTypes.ENUM(IsBoolean.values()), '봉사여부', false, { defaultValue: IsBoolean.N.value }),
			start_date: field(DataTypes.DATE, '시작일'),
			end_date: field(DataTypes.DATE, '마감일'),
			thumbnail_file_key: field(DataTypes.STRING(64), '썸네일'),
			is_homework: field(DataTypes.ENUM(IsBoolean.values()), '과제 여부', false, { defaultValue: IsBoolean.N.value }),
			is_app: field(DataTypes.ENUM(IsBoolean.values()), '앱 여부', false, { defaultValue: IsBoolean.N.value }),
			is_active_rrn: field(DataTypes.ENUM(IsBoolean.values()), '주민번호 활성화 여부', false, { defaultValue: IsBoolean.N.value }),
			is_active_address: field(DataTypes.ENUM(IsBoolean.values()), '주소 활성화 여부', false, { defaultValue: IsBoolean.N.value }),
			is_active_bank: field(DataTypes.ENUM(IsBoolean.values()), '계좌 활성화 여부', false, { defaultValue: IsBoolean.N.value }),
			total_task_cnt: field(DataTypes.INTEGER(16).UNSIGNED, '총 작업량'),
			point_per_task: field(DataTypes.INTEGER(16).UNSIGNED, '작업 건당 포인트'),
			max_user_cnt: field(DataTypes.INTEGER(8).UNSIGNED, '최대 참여인수'),
			user_max_task_cnt: field(DataTypes.INTEGER(16).UNSIGNED, '인당 최대 작업량'),
			voluntary_hour_per_task: field(DataTypes.INTEGER(8).UNSIGNED, '봉사시간당 작업 수'),
			user_voluntary_hour: field(DataTypes.INTEGER(8).UNSIGNED, '인당 최대 봉사시간'),
			additional_task_cnt: field(DataTypes.INTEGER(8).UNSIGNED, '추가 가능건수'),
			sumpayment_point: field(DataTypes.INTEGER(16).UNSIGNED, '일괄지급 포인트'),
			sumpayment_task_cnt: field(DataTypes.INTEGER(8).UNSIGNED, '일괄지급 인정건수'),
		},
		// options
		{
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'prj_project',
			comment: '프로젝트 기본정보',
			sequelize,
		},
	);

	return Project;
};
