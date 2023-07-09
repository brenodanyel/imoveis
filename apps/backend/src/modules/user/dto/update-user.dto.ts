import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsStrongPassword, Length, ValidateIf } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ValidateIf((_, value) => value !== '')
	@Length(6, 99)
	@IsNotEmpty()
	@IsStrongPassword(
		{
			minLength: 6,
			minLowercase: 0,
			minUppercase: 0,
			minNumbers: 1,
			minSymbols: 1,
		},
		{ message: 'Senha muito fraca!' },
	)
	password: string;
}
