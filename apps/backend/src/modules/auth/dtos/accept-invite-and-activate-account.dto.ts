import { IsString, Length } from 'class-validator';

export class AcceptInviteAndActivateAccountUseCaseDTO {
	@Length(0, 255, { message: 'Token inválido!' })
	@IsString({ message: 'Token inválido!' })
	q: string;
}
