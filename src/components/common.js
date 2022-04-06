import crypto from 'crypto';
import { parsePhoneNumber } from 'libphonenumber-js';

// 국제전화번호를 국내 전화번호로 변경
export const getNationalPhoneNumber = (phoneNumber, countryCode = 'KR') => {
	try {
		const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode);
		return parsedPhoneNumber.formatNational();
	} catch (e) {
		throw new Error('Not a valid phone number.');
	}
};

// 현재 일시 반환
export const nowDateTime = async () => {
	const date = new Date();
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 날짜 형태 반환
export const getDateFormat = async (input) => {
	const response = `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()}`;
	return response;
};

// 이전 날짜 반환
export const getLastDate = async (input) => {
	const date = new Date();
	const dayOfMonth = date.getDate();
	date.setDate(dayOfMonth - parseInt(input, 10));
	const response = await getDateFormat(date);
	return response;
};

// 날짜 형태 반환
export const getDateTimeFormat = async (input) => {
	const date = new Date(input);
	date.setDate(date.getDate() + 1);
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 입력받은 날짜에 일자를 추가하여 반환
export const getDatePlusDate = async (input, plusDate) => {
	const date = new Date(input);
	date.setDate(date.getDate() + plusDate);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// 현재 날짜 + n일 일자 반환
export const nowDatePlusDate = async (input) => {
	const date = new Date();
	date.setDate(date.getDate() + parseInt(input, 10));
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 자릿수 정렬
export const digitsSort = async (nParam, width) => {
	let n = nParam;
	n += '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

// 숫자만 반환
export const returnNumberOnly = async (value) => {
	return value.replace(/[^\d]/gi, '');
};

// return Offset
export const getOffset = async (page, limit) => {
	const offset = (parseInt(page, 10) - parseInt(1, 10)) * limit;
	return offset < 0 ? 0 : offset;
};

// 이메일 형태 확인
export const isValidEmail = (value) => (decodeURIComponent(value).match(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i) ? true : false); // eslint-disable-line

// 랜덤 숫자 반환
export const getRandomInteger = async (min, max) => {
	return Math.floor(Math.random() * (max - min - 1)) + min;
};

// 리뷰 유효일자 반환
export const getReviewExpireTime = async () => {
	const date = new Date();
	date.setDate(date.getDate() + parseInt(process.env.REVIEW_AUTH_EXPIRE_DATE, 10));
	return `${date.toISOString().split('T')[0]} ${date.toTimeString().split(' ')[0]}`;
};

// 입력받은 길이를 기준으로 자릿수 반환
export const getLengthByCritertiaNumber = async (input, critertiaNumber) => {
	const data = input.toString();
	const dataDigit = data.length;
	return parseInt(dataDigit, 10) / parseInt(critertiaNumber, 10);
};

// 전달받은 Array 를 구분자를 추가하여 반환
export const returnArrayToStringAddDelimiter = async (arrayItem, delimiter) => {
	let returnString = '';
	for (let i = 0; i < arrayItem.length; i += 1)
		returnString = i !== parseInt(arrayItem.length, 10) - parseInt(1, 10) ? `${returnString + arrayItem[i] + delimiter} ` : returnString + arrayItem[i];
	// Return
	return returnString;
};

// 전달받은 Array 의 공통을 반환
export const returnCommonArray = async (firstArray, secondArray) => {
	const commonArray = [];
	for (let i = 0; i < secondArray.length; i += 1)
		if (firstArray.includes(parseInt(secondArray[i], 10)) && !commonArray.includes(parseInt(secondArray[i], 10))) commonArray.push(parseInt(secondArray[i], 10));
	// Return
	return Object.keys(commonArray).length > 0 ? commonArray : null;
};

/**
 * @description 수를 나누어 반환
 * @param {Int} dividend
 * @param {Int} divisor
 * @param {Boolean} useDecimal
 */
export const divideNumber = async (dividend, divisor, useDecimal) => {
	let response = 0;
	if (dividend && dividend !== 0 && divisor && divisor !== 0)
		response = useDecimal ? (parseInt(dividend, 10) / parseInt(divisor, 10)) * parseInt(10000, 10) : parseInt(dividend, 10) / parseInt(divisor, 10);
	return parseInt(response, 10);
};

/**
 * @description 알파벳 소대문자로 이루어진 랜덤 문자열 반환
 * @param {Int} length
 */
export const generateRandomString = (length) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

export const encrypt = (plaintext, key, iv, inputEncoding = 'utf8', outputEncoding = 'base64') => {
	let algorithm = '';
	if (key.length === 32) {
		algorithm = 'aes-256-cbc';
	} else if (key.length === 16) {
		algorithm = 'aes-128-cbc';
	} else {
		throw new Error('Invalid key');
	}
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(plaintext, inputEncoding, outputEncoding);
	encrypted += cipher.final(outputEncoding);

	return encrypted;
};

export const decrypt = (message, key, iv, inputEncoding = 'base64') => {
	const algorithm = key.length === 32 ? 'aes-256-cbc' : 'aes-128-cbc';
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(message, inputEncoding);
	decrypted += decipher.final();

	return decrypted;
};

export const encodeBase64 = (data) => {
	return Buffer.from(data).toString('base64');
};

export const decodeBase64 = (data) => {
	return Buffer.from(data, 'base64').toString('utf8');
};

export const getDateWithFormat = (date, format) => {
	const year = date.getFullYear().toString();
	let month = date.getMonth() + 1;
	month = month < 10 ? `0${month}` : month;
	let day = date.getDate();
	day = day < 10 ? `0${day}` : day;
	let hour = date.getHours();
	hour = hour < 10 ? `0${hour}` : hour;
	let min = date.getMinutes();
	min = min < 10 ? `0${min}` : min;
	let sec = date.getSeconds();
	sec = sec < 10 ? `0${sec}` : sec;

	switch (format) {
		case 'yyyyMMddhhmmss':
			return [year, month, day, hour, min, sec].join('');
		case 'yyyyMMdd':
			return [year, month, day].join('');
		case 'yyyy-MM-dd':
			return [year, month, day].join('-');
		case 'yyMMdd':
			return [year.slice(-2), month, day].join('');
		default:
			return [year, month, day, hour, min, sec].join('');
	}
}
  
export const getProjectCode = (projectType) => {
	let first = null;
	if (projectType === 'TYPE1') {
		first = 'P';
	} else if (projectType === 'TYPE2') {
		first = 'N';
	} else {
		first = 'C';
	}
	const nowDate = new Date();
	const projectCode = first + nowDate.getFullYear() + (nowDate.getMonth() + 1) + nowDate.getDate() + (Math.floor(Math.random() * (100 - 10)) + 10);
	return projectCode;
};
