import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ListarAnuncioDTO {
	@IsInt({ message: 'id deve ser um inteiro' })
	@Type(() => Number)
	id: number;
}
