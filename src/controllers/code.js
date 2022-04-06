import * as codeService from '../services/code/code';

// 코드 목록 조회
export const getCodesByType = async (req) => {
	const codeType = req.body.code_type;

	const response = await codeService.getCodeListByType(codeType);

	return response;
};

// 코드 생성
export const postCode = async (req) => {
	const codeData = {
		code_type: req.body.code_type,
		code: req.body.code,
		code_name: req.body.code_name,
		message: req.body.message,
	};

	const response = await codeService.postCode(codeData);

	return response;
};
