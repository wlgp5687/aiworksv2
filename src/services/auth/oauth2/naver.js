import uuidv4 from 'uuid/v4';
import axios from 'axios';
import { throwError } from '../../index';

const getAgeCodeFromNaverAgeRange = (ageRange) => {
	switch (ageRange) {
		case '10-14': {
			return 'AGE1';
		}
		case '15-19': {
			return 'AGE1';
		}
		case '20-29': {
			return 'AGE2';
		}
		case '30-39': {
			return 'AGE3';
		}
		case '40-49': {
			return 'AGE4';
		}
		case '50-59': {
			return 'AGE5';
		}
		case '60-69': {
			return 'AGE6';
		}
		case '70-79': {
			return 'AGE7';
		}
		case '80-89': {
			return 'AGE8';
		}
		default: {
			return null;
		}
	}
};

// 'F'|'M'|'U -> 'MAN'|'WOMAN'|null
const getGenderFromNaverGender = (gender) => {
	switch (gender) {
		case 'M': {
			return 'MAN';
		}
		case 'F': {
			return 'WOMAN';
		}
		default: {
			return null;
		}
	}
};

// 'yyyy', 'MM-dd' to yyyy-MM-dd
const getBirthdayFromNaverBirthday = (birthYear, birthday) => {
	if (!(birthYear && birthday)) {
		return null;
	}
	return `${birthYear}-${birthday}`;
};

const generateMemberInfo = (memberData) => {
	return {
		channel: 'NAVER',
		sns_id: memberData.id,
		login_id: uuidv4(),
		password: uuidv4(),
		name: memberData.name,
		email: memberData.email,
		gender_code: getGenderFromNaverGender(memberData.gender),
		birthday: getBirthdayFromNaverBirthday(memberData.birthYear, memberData.birthday),
		age_cd: getAgeCodeFromNaverAgeRange(memberData.age),
		phone: memberData.mobile,
	};
};

export const getSnsLoginUrl = (state) => {
	const loginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&state=${state}&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.FRONT_PAGE_URL}/oauth/naver/callback`;
	return loginUrl;
};

export const getSnsMemberInfo = async (accessToken) => {
	let response;
	try {
		response = await axios('https://openapi.naver.com/v1/nid/me', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	} catch (err) {
		throwError(err, 400);
	}

	const snsMemberData = response.data.response;
	const memberInfo = generateMemberInfo(snsMemberData);
	return memberInfo;
};

export const getAccessToken = async (code, state) => {
	let response;
	try {
		response = await axios('https://nid.naver.com/oauth2.0/token', {
			method: 'POST',
			headers: {
				'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
				'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
			},
			params: {
				grant_type: 'authorization_code',
				client_id: process.env.NAVER_CLIENT_ID,
				client_secret: process.env.NAVER_CLIENT_SECRET,
				redirect_uri: `${process.env.FRONT_PAGE_URL}/oauth/callback`,
				code,
				state,
			},
		});
	} catch (err) {
		throwError(err, 400);
	}
	return response.data.access_token;
};
