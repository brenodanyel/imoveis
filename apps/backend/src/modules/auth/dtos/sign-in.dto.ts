import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class SignInDTO {
	@Length(10, 55, { message: 'O email deve ter entre 10 e 55 caracteres!' })
	@IsNotEmpty({ message: 'O email não pode ser vazio!' })
	@IsEmail({}, { message: 'O email deve ser válido!' })
	email: string;

	@Length(6, 99, { message: 'A senha deve ter entre 6 e 99 caracteres!' })
	@IsNotEmpty({ message: 'A senha não pode ser vazia!' })
	@IsStrongPassword(
		{
			minLength: 6,
			minLowercase: 0,
			minUppercase: 0,
			minNumbers: 1,
			minSymbols: 1,
		},
		{ message: 'A senha deve conter pelo menos 1 número e 1 símbolo!' },
	)
	password: string;
}
