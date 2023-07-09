import isStrongPassword from 'validator/lib/isStrongPassword';

import { dayjs } from './dayjs';

export function validatePassword(val: string) {
	return (
		isStrongPassword(val, {
			minLength: 6,
			minLowercase: 0,
			minUppercase: 0,
			minNumbers: 1,
			minSymbols: 1,
		}) || 'A senha deve conter no mínimo 6 caracteres, 1 número e 1 caractere especial.'
	);
}

export function optional(val: string, callback: (val: string) => true | string) {
	if (!val) return true;
	return callback(val);
}

export function isValidDate(date: string) {
	return dayjs(date).isValid();
}
