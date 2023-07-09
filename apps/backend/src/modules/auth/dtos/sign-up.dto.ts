import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsString, Length, Validate, ValidateNested } from 'class-validator';
import { IsValidCPF } from '../../../utils/commons.validator';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';

class UserDTO {
	@IsString({ message: 'O campo "name" deve ser uma string!' })
	@Length(1, 55, { message: 'O campo "name" deve conter entre 1 e 55 caracteres!' })
	@IsNotEmpty({ message: 'O campo "name" deve ser preenchido!' })
	name: string;

	@IsString({ message: 'O campo "password" deve ser uma string!' })
	@IsNotEmpty({ message: 'O campo "password" deve ser preenchido!' })
	@Validate(IsValidCPF)
	cpf: string;

	@IsString({ message: 'O campo "password" deve ser uma string!' })
	@Length(1, 55, { message: 'O campo "password" deve conter entre 1 e 55 caracteres!' })
	@IsNotEmpty({ message: 'O campo "password" deve ser preenchido!' })
	@IsEmail({}, { message: 'O campo "email" deve ser um email válido!' })
	email: string;
}

export class SignUpDTO {
	@IsObject({ message: 'O campo "user" deve ser um objeto!' })
	@ValidateNested({ message: 'O campo "user" deve ser um objeto!' })
	@Type(() => UserDTO)
	user: UserDTO;

	@IsObject({ message: 'O campo "company" deve ser um objeto!' })
	@ValidateNested({ message: 'O campo "company" deve ser um objeto!' })
	@Type(() => CreateCompanyDto)
	company: CreateCompanyDto;
}
