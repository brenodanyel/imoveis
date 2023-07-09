import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class ListUsersDto extends Pagination {
	@IsOptional()
	@IsString({ message: 'O campo "filter" deve ser uma string!' })
	filter?: string;

	@IsOptional()
	@IsNumberString({}, { each: true, message: 'O campo "roles" deve conter um array de números!' })
	roles?: string[];
}
