import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl, Length, Min, ValidateNested } from 'class-validator';
import { EnderecoDTO } from '../../../../utils/commons.validator';

class SubcategoriaDTO {
	@IsInt({ message: 'id deve ser um inteiro' })
	id: number;
}

class AnuncioImagemDTO {
	@IsString({ message: 'url deve ser uma string' })
	@IsUrl({}, { message: 'url deve ser uma url válida' })
	url: string;
}

export class CriarAnuncioDTO {
	@IsNotEmpty({ message: 'titulo é obrigatório' })
	@Length(5, 100, { message: 'titulo deve ter entre 5 e 100 caracteres' })
	titulo: string;

	@IsNotEmpty({ message: 'descricao é obrigatório' })
	@Length(5, 5000, { message: 'descricao deve ter entre 5 e 5000 caracteres' })
	descricao: string;

	@IsNotEmpty({ message: 'proposito é obrigatório' })
	proposito: string;

	@IsInt({ message: 'valor deve ser um inteiro' })
	@Min(0, { message: 'valor deve ser maior ou igual a 0' })
	valor: number;

	@IsInt({ message: 'valor_iptu deve ser um inteiro' })
	@Min(0, { message: 'valor_iptu deve ser maior ou igual a 0' })
	valor_iptu: number;

	@IsInt({ message: 'valor_condominio deve ser um inteiro' })
	@Min(0, { message: 'valor_condominio deve ser maior ou igual a 0' })
	valor_condominio: number;

	@IsObject({ message: 'subcategoria deve ser um objeto' })
	@ValidateNested({ message: 'subcategoria deve ser um objeto' })
	subcategoria: SubcategoriaDTO;

	@IsObject({ message: 'endereco deve ser um objeto' })
	@ValidateNested({ message: 'endereco deve ser um objeto' })
	@Type(() => EnderecoDTO)
	endereco: EnderecoDTO;

	@Min(0, { message: 'area_total deve ser maior ou igual a 0' })
	@Type(() => Number)
	area_total: number;

	@Min(0, { message: 'area_construida deve ser maior ou igual a 0' })
	@Type(() => Number)
	area_construida: number;

	@IsObject({ message: 'caracteristicas deve ser um objeto' })
	caracteristicas: Record<string, number>;

	@IsNotEmpty({ each: true, message: 'comodidades deve ser um array de objetos' })
	comodidades: string[];

	@IsString({ message: 'thumbnail deve ser uma string' })
	@IsUrl({}, { message: 'thumbnail deve ser uma url válida' })
	@IsOptional()
	thumbnail: string;

	@IsNotEmpty({ each: true, message: 'imagens deve ser um array de objetos' })
	@ValidateNested({ each: true, message: 'imagens deve ser um array de objetos' })
	@Type(() => AnuncioImagemDTO)
	imagens: AnuncioImagemDTO[];
}
