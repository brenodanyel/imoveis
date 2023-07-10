import { IsInt, IsNumberString, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Pagination } from '../../../utils/commons.validator';

export class ListarAnunciosDTO extends Pagination {
	@IsString({ message: 'proposito deve ser uma string' })
	@ValidateIf((v) => v !== null)
	@IsOptional()
	proposito?: string | null;

	@IsInt({ message: 'subcategorias deve ser um inteiro', each: true })
	@IsOptional()
	subcategorias?: number[];

	@IsNumberString({}, { message: 'min_valor deve ser um inteiro' })
	@ValidateIf((v: ListarAnunciosDTO) => !!v.min_valor)
	@IsOptional()
	min_valor?: number | null;

	@IsNumberString({}, { message: 'max_valor deve ser um inteiro' })
	@ValidateIf((v: ListarAnunciosDTO) => !!v.max_valor)
	@IsOptional()
	max_valor?: number | null;

	@IsInt({ message: 'comodidades deve ser um inteiro', each: true })
	@IsOptional()
	comodidades?: number[];
}
