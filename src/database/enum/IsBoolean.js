import { Enum } from './enumify';

export default class IsBoolean extends Enum {}

IsBoolean.initEnum({
	Y: {
		get value() {
			return 'Y';
		},
		get boolValue() {
			return true;
		},
	},
	N: {
		get value() {
			return 'N';
		},
		get boolValue() {
			return false;
		},
	},
});
