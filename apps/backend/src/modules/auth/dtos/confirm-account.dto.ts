import { IsString, Length } from 'class-validator';

export class ConfirmAccountDTO {
	@Length(0, 255, { message: 'Token inválido!' })
	@IsString({ message: 'Token inválido!' })
	q: string;
}
