import { Enum } from './enumify';

export default class Sex extends Enum {}

Sex.initEnum({
	MAN: {
		get value() {
			return 'MAN';
		},
		get alias() {
			return '남자';
		},
	},
	WOMAN: {
		get value() {
			return 'WOMAN';
		},
		get alias() {
			return '여자';
		},
	},
});
