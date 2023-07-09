import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Length,
	Validate,
	ValidateNested,
} from 'class-validator';
import { IsValidCPF } from '../../../utils/commons.validator';

export class CreateUserDto {
	@Length(3, 55, { message: 'O nome deve ter entre 3 e 55 caracteres!' })
	@IsNotEmpty({ message: 'O nome não pode ser vazio!' })
	name: string;

	@Length(10, 55, { message: 'O email deve ter entre 10 e 55 caracteres!' })
	@IsNotEmpty({ message: 'O email não pode ser vazio!' })
	@IsEmail({}, { message: 'O email deve ser válido!' })
	email: string;

	@IsString({ message: 'O CPF deve ser uma string!' })
	@Validate(IsValidCPF, { message: 'O CPF deve ser válido!' })
	cpf: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateUserCompaniesDto)
	userCompanies: CreateUserCompaniesDto[];

	@IsOptional()
	@IsBoolean()
	active?: boolean;
}

class CreateUserCompaniesDto {
	@IsNumber({}, { message: 'O id da empresa deve ser um número!' })
	@IsPositive({ message: 'O id da empresa deve ser um número positivo!' })
	id: number;

	@IsNumber({}, { each: true, message: 'O campo "roleIds" deve conter um array de números' })
	@IsPositive({ each: true, message: 'O campo "roleIds" deve conter um array de números positivos' })
	roleIds: number[];
}
