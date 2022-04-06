import { getModel, Op } from '../../database';

const Code = getModel('Code');

export const getCodeListByType = async (codeType) => {
	const response = await Code.findAll({
		attributes: ['id', 'code_type', 'code', 'code_name'],
		where: { code_type: { [Op.in]: codeType } },
	});
	return response;
};

export const postCode = async (codeData, t) => {
	const response = await Code.create(codeData, { transaction: t });
	return response;
};
