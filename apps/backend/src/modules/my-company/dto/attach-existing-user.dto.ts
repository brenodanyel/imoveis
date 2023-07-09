import { IsInt } from 'class-validator';

export class AttachExistingUserDto {
	@IsInt({ each: true, message: 'O campo "users" deve conter um array de números inteiros!' })
	roles: number[];
}
