import { IsEmail, IsInt, IsString, Length, Validate } from 'class-validator';
import { IsValidCPF } from '../../../utils/commons.validator';

export class CreateUserDto {
	@Length(3, 255, { message: 'O nome deve ter entre 3 e 255 caracteres!' })
	@IsString({ message: 'O nome deve ser uma string!' })
	name: string;

	@Length(3, 255, { message: 'O email deve ter entre 3 e 255 caracteres!' })
	@IsEmail({}, { message: 'O email deve ser válido!' })
	email: string;

	@IsString({ message: 'O CPF deve ser uma string!' })
	@Validate(IsValidCPF)
	cpf: string;

	@IsInt({ each: true, message: 'O campo "roles" deve conter um array de números' })
	roles: number[];
}
