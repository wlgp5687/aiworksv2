import axios from 'axios';
import uuidv4 from 'uuid/v4';
import crypto from 'crypto';
import { encodeBase64 } from '../common';

const generateAuthorization = (time) => {
	const currentTime = Math.round(time.getTime() / 1000);
	return `bearer ${encodeBase64(`${process.env.NICE_API_ACCESS_TOKEN}:${currentTime}:${process.env.NICE_API_CLIENT_ID}`)}`;
};

const getProductCode = (productType) => {
	switch (productType) {
		case 'NAME_CHECK':
			return process.env.NICE_API_PRODUCT_CODE_NAME_CHECK;
		case 'FOREIGN_NAME_CHECK':
			return process.env.NICE_API_PRODUCT_CODE_FOREIGN_NAME_CHECK;
		case 'ACCOUNT_CHECK':
			return process.env.NICE_API_PRODUCT_CODE_ACCOUNT_CHECK;
		default:
			throw new Error(`Invalid product type ${productType}`);
	}
};

export const requestCryptoToken = async (productType, date, requestDatetime, randomString) => {
	try {
		const response = await axios(' https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: generateAuthorization(date),
				client_id: process.env.NICE_API_CLIENT_ID,
				ProductID: getProductCode(productType),
			},
			data: {
				dataHeader: {
					CITY_CD: 'ko',
				},
				dataBody: {
					req_dtim: requestDatetime,
					req_no: randomString,
					enc_mode: '1',
				},
			},
		});
	
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const generateKeys = (requestDatetime, requestNumber, tokenVal) => {
	const value = `${requestDatetime}${requestNumber}${tokenVal}`;
	const hashed = crypto.createHash('sha256').update(value).digest('base64');
	return {
		key: hashed.substring(0, 16),
		iv: hashed.substring(hashed.length - 16),
		hmacKey: hashed.substring(hashed.length - 32),
	};
};

export const generateHMac = (key, message) => {
	const hashed = crypto.createHmac('sha256', key).update(message).digest('base64');
	return hashed;
};

// 은행코드+계좌번호+성명+생년월일의 일치 여부를 확인해주는 API
export const checkAccountOwner = async (accountData, randomString) => {
	const currentTime = new Date();

	try {
		const response = await axios({
			url: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/account/owner',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: generateAuthorization(currentTime),
				client_id: process.env.NICE_API_CLIENT_ID,
				productID: process.env.NICE_API_PRODUCT_CODE_ACCOUNT_CHECK,
			},
			data: {
				dataHeader: {
					CNTY_CD: 'ko',
				},
				dataBody: {
					acct_gb: accountData.account_gb,
					birthday: accountData.birthday,
					bnk_cd: accountData.bank_code,
					acct_no: accountData.account_number,
					name: accountData.name,
					request_no: randomString,
				},
			},
		});
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const checkName = async (tranId, tokenVersionId, integrity, encryptedName, encryptedJumin) => {
	const currentTime = new Date();
	try {
		const response = await axios({
			url: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/name/national/check',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: generateAuthorization(currentTime),
				ProductID: process.env.NICE_API_PRODUCT_CODE_NAME_CHECK,
			},
			data: {
				dataHeader: {
					CNTY_CD: 'ko',
					TRAN_ID: tranId,
				},
				dataBody: {
					token_version_id: tokenVersionId,
					enc_jumin_id: encryptedJumin,
					enc_name: encryptedName,
					integrity_value: integrity,
				},
			},
		});
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const checkForeignerName = async (tranId, tokenVersionId, integrity, encryptedName, encryptedForeignerId) => {
	const currentTime = new Date();
	try {
		const response = await axios({
			url: 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/name/foreigner/check',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: generateAuthorization(currentTime),
				ProductID: process.env.NICE_API_PRODUCT_CODE_FOREIGN_NAME_CHECK,
			},
			data: {
				dataHeader: {
					CNTY_CD: 'ko',
					TRAN_ID: tranId,
				},
				dataBody: {
					token_version_id: tokenVersionId,
					enc_foreigner_id: encryptedForeignerId,
					enc_name: encryptedName,
					integrity_value: integrity,
				},
			},
		});
		return response.data;
	} catch (error) {
		return error.response.data;
	}
}
