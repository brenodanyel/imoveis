import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class FindAllDto extends Pagination {
	@IsOptional()
	@IsString({ message: 'O campo "filter" deve ser uma string!' })
	filter?: string;

	@IsOptional()
	@IsNumberString({}, { each: true, message: 'O campo "companies" deve conter um array de números!' })
	companies?: string[];

	@IsOptional()
	@IsNumberString({}, { each: true, message: 'O campo "roles" deve conter um array de números!' })
	roles?: string[];
}
