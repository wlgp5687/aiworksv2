import * as codeComponent from '../../components/code/code';
import { sequelize } from '../../database';

export const getCodeListByType = async (codeType) => {
	const codes = await codeComponent.getCodeListByType(codeType);

	return codes;
};

export const postCode = async (codeData) => {
	let reponse = null;
	await sequelize.transaction(async (t) => {
		reponse = await codeComponent.postCode(codeData, t);
	});

	return reponse;
};
