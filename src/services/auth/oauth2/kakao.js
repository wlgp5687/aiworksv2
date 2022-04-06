import uuidv4 from 'uuid/v4';
import axios from 'axios';
import { getNationalPhoneNumber } from '../../../components/common';
import { throwError } from '../../index';

const getAgeCodeFromKakaoAgeRange = (ageRange) => {
	switch (ageRange) {
		case '10~14': {
			return 'AGE1';
		}
		case '15~19': {
			return 'AGE1';
		}
		case '20~29': {
			return 'AGE2';
		}
		case '30~39': {
			return 'AGE3';
		}
		case '40~49': {
			return 'AGE4';
		}
		case '50~59': {
			return 'AGE5';
		}
		case '60~69': {
			return 'AGE6';
		}
		case '70~79': {
			return 'AGE7';
		}
		case '80~89': {
			return 'AGE8';
		}
		default: {
			return null;
		}
	}
};

// 'male'|'female' -> 'MAN'|'WOMAN'
const getGenderFromKakaoGender = (gender) => {
	switch (gender) {
		case 'male': {
			return 'MAN';
		}
		case 'female': {
			return 'WOMAN';
		}
		default: {
			return null;
		}
	}
};

// 'yyyy', 'MMdd' to yyyy-MM-dd
const getBirthdayFromKakaoBirthday = (birthYear, birthday) => {
	const dateString = `${birthYear}${birthday}`;

	if (!/^(\d){8}$/.test(dateString)) {
		return null;
	}

	const y = dateString.substring(0, 4);
	const m = dateString.substring(4, 2) - 1;
	const d = dateString.substring(6, 2);

	return `${y}-${m}-${d}`;
};

const getPhoneNumberFromKakaoPhoneNumber = (phoneNumber) => {
	if (!phoneNumber) {
		return null;
	}
	return getNationalPhoneNumber(phoneNumber);
};

const generateMemberInfo = (snsMemberData) => {
	return {
		channel: 'KAKAO',
		sns_id: snsMemberData.id,
		login_id: uuidv4(),
		password: uuidv4(),
		name: snsMemberData.kakao_account.name || null,
		email: snsMemberData.kakao_account.email || null,
		gender_code: getGenderFromKakaoGender(snsMemberData.kakao_account.gender),
		birthday: getBirthdayFromKakaoBirthday(snsMemberData.kakao_account.birth_year, snsMemberData.kakao_account.birthday),
		age_cd: getAgeCodeFromKakaoAgeRange(snsMemberData.kakao_account.age_range),
		phone: getPhoneNumberFromKakaoPhoneNumber(snsMemberData.kakao_account.phone_number),
	};
};

export const getSnsLoginUrl = (state) => {
	const loginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&state=${state}&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.FRONT_PAGE_URL}/oauth/kakao/callback`;
	return loginUrl;
};

export const getSnsMemberInfo = async (accessToken) => {
	const response = await axios('https://kapi.kakao.com/v2/user/me', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	}).catch((err) => throwError(err, 400));
	const snsMemberData = response.data;
	const memberInfo = generateMemberInfo(snsMemberData);
	return memberInfo;
};

export const getAccessToken = async (code, state) => {
	let response;
	try {
		response = await axios('https://kauth.kakao.com/oauth/token', {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			params: {
				grant_type: 'authorization_code',
				client_id: process.env.KAKAO_CLIENT_ID,
				client_secret: process.env.KAKAO_CLIENT_SECRET,
				redirect_uri: `${process.env.FRONT_PAGE_URL}/oauth/kakao/callback`,
				code,
				state,
			},
		});
	} catch (err) {
		throwError(err.response.data.error_description, 400);
	}

	const accessToken = response.data.access_token;
	return accessToken;
};
