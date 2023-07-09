import { IsBooleanString, IsOptional } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class FindAllDto extends Pagination {
	filter?: string;

	@IsOptional()
	@IsBooleanString({ message: 'O campo "active" deve ser um booleano!' })
	active?: string;

	@IsOptional()
	@IsBooleanString({ message: 'O campo "public" deve ser um booleano!' })
	public?: string;
}
