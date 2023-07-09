import { IsInt } from 'class-validator';

export class SwitchCompanyDTO {
	@IsInt({ message: 'O campo "companyId" deve ser um número inteiro!' })
	companyId: number;
}
