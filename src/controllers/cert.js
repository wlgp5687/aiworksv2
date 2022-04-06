import * as certService from '../services/cert';
import { throwError } from '../services';

export const checkAccountValidation = async (req) => {
	const { memberId } = req.params;
	const accountData = {
		account_gb: req.body.account_gb,
		bank_code: req.body.bank_code,
		account_number: req.body.account_number,
	};
	const result = await certService.checkAccountValidation(memberId, accountData);
	return result;
};

export const checkNameValidation = async (req) => {
	const { name, jumin } = req.body;
	const result = await certService.nameCheck('NAME_CHECK', name, jumin);
	return result;
};

export const checkForeignNameValidation = async (req) => {
	const { name, foreigner_id } = req.body;
	const result  = await certService.nameCheck('FOREIGN_NAME_CHECK', name, foreigner_id);
	return result;
};
