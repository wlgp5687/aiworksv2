import iconv from 'iconv-lite';
import * as niceApiComponent from '../components/api/niceApi';
import * as memberComponent from '../components/member/member';
import { generateRandomString, getDateWithFormat, encrypt } from '../components/common';
import { throwError } from '.';

const niceApiDefaultResponseCheck = (response, randomString) => {
	if (response.dataHeader.GW_RSLT_CD !== '1200') {
		return throwError(response.dataHeader.GW_RSLT_MSG, 500);
	}
	if (response.dataBody.rsp_cd !== 'P000') {
		return throwError(response.dataBody.res_msg, 500);
	}
	if (randomString !== response.dataBody.request_no) {
		return throwError('Invalid request number', 402);
	}
	if (response.dataBody.result_cd !== '0000') {
		return throwError('Invalid account', 402);
	}

	return true;
};

export const checkAccountValidation = async (memberId, accountData) => {
	const member = await memberComponent.getMemberDetailById(memberId);
	if (!member) throwError('No such member', 404);

	const birthday = getDateWithFormat(new Date(member.MemberInfo.dataValues.birthday), 'yyMMdd');

	accountData.name = member.MemberInfo.dataValues.name;
	accountData.birthday = birthday;

	const randomString = generateRandomString(30);
	const response = await niceApiComponent.checkAccountOwner(accountData, randomString);
	niceApiDefaultResponseCheck(response, randomString);

	const memberAccountData = {
		bank_cd: accountData.bank_code,
		account_name: member.MemberInfo.dataValues.name,
		account_num: accountData.account_number,
	};

	await memberComponent.updateMemberInfo(memberId, memberAccountData);
	return true;
};

export const nameCheck = async (nameType, name, personalId) => {
	const currentTime = new Date();
	const requestDatetime = getDateWithFormat(currentTime, 'yyyyMMddhhmmss');
	const requestNumber = generateRandomString(30);

	const cryptoTokenResponse = await niceApiComponent.requestCryptoToken(nameType, currentTime, requestDatetime, requestNumber);

	if (cryptoTokenResponse.dataHeader.GW_RSLT_CD !== '1200') {
		return throwError(cryptoTokenResponse.dataHeader.GW_RSLT_MSG, 500);
	}
	if (cryptoTokenResponse.dataBody.rsp_cd !== 'P000') {
		return throwError(cryptoTokenResponse.dataBody.res_msg, 500);
	}
	if (cryptoTokenResponse.dataBody.result_cd !== '0000') {
		return throwError('Invalid account', 402);
	}

	const tokenVersionId = cryptoTokenResponse.dataBody.token_version_id;
	const cryptoToken = cryptoTokenResponse.dataBody.token_val.trim();

	const { key, iv, hmacKey } = niceApiComponent.generateKeys(requestDatetime, requestNumber, cryptoToken);

	const encodedName = iconv.encode(name, 'euc-kr');

	const encryptedName = encrypt(encodedName, key, iv).toString('base64');
	const encryptedPersonalId = encrypt(personalId, key, iv).toString('base64');

	const integrityValue = `${tokenVersionId.trim()}${encryptedPersonalId.trim()}${encryptedName.trim()}`;
	const integrity = niceApiComponent.generateHMac(hmacKey, integrityValue);
	const tranId = generateRandomString(24);

	const nameCheckMethod = nameType === 'NAME_CHECK'? niceApiComponent.checkName : niceApiComponent.checkForeignerName
	const nameCheckResponse = await nameCheckMethod(tranId, tokenVersionId, integrity, encryptedName, encryptedPersonalId);

	if (nameCheckResponse.dataHeader.TRAN_ID !== tranId) {
		return throwError('Invalid transaction id', 402);
	}
	if (nameCheckResponse.dataHeader.GW_RSLT_CD !== '1200') {
		return throwError(nameCheckResponse.dataHeader.GW_RSLT_MSG, 500);
	}
	if (nameCheckResponse.dataBody.rsp_cd !== 'P000') {
		return throwError(nameCheckResponse.dataBody.res_msg, 500);
	}	

	switch (nameCheckResponse.dataBody.result_cd) {
		case '1':
			return true;
		case '2':
			return throwError('성명 불일치', 200);
		case '3':
			return throwError('당사 성명 미보유', 200);
		case '7':
			return throwError('명의 도용 차단', 200);
		case '8':
			return throwError('부정사용 의심 정보 차단', 200);
		default:
			return throwError(`Unknown result code ${nameCheckResponse.dataBody.result_cd}`, 500);
	}
};
