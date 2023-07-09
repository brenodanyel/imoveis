import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class FindByDto extends Pagination {
	@IsOptional()
	@IsString({ message: 'O email deve ser uma string!' })
	email?: string;

	@IsOptional()
	@IsNumberString({ no_symbols: true }, { message: 'O id deve ser um número!' })
	id?: string;
}
