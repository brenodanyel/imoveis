import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class FindAllDto extends Pagination {
	filter?: string;

	@IsOptional()
	@IsNumberString({}, { each: true, message: 'O campo "companies" deve conter um array de números!' })
	plans?: string[];

	@IsOptional()
	@IsBooleanString({ message: 'O campo "active" deve ser um booleano!' })
	includeAddress?: boolean;

	@IsOptional()
	@IsBooleanString({ message: 'O campo "public" deve ser um booleano!' })
	includePlan?: boolean;
}
