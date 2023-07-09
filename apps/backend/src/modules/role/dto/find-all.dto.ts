import { IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class FindAllDto extends Pagination {
	@IsOptional()
	@IsString({ message: 'O campo "filter" deve ser uma string!' })
	filter?: string;
}
