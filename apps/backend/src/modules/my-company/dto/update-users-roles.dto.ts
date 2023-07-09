import { IsInt, IsPositive } from 'class-validator';

export class UpdateUsersRolesDto {
	@IsPositive({ each: true, message: 'O campo "users" deve conter um array de números positivos!' })
	@IsInt({ each: true, message: 'O campo "users" deve conter um array de números inteiros!' })
	roles?: number[];
}
