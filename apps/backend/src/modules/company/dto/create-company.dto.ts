import { Type } from 'class-transformer';
import {
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsNumberString,
	IsObject,
	IsOptional,
	Length,
	Validate,
	ValidateIf,
	ValidateNested,
} from 'class-validator';
import { Address, IsValidCNPJ } from '../../../utils/commons.validator';

class CompanyPlan {
	@IsDateString()
	paidAt: string;

	@IsDateString()
	expiresAt: string;

	@IsNumber()
	planId: number;
}

export class CreateCompanyDto {
	@IsNotEmpty()
	@Length(1, 200, { message: 'O campo "name" deve conter entre 1 e 200 caracteres!' })
	name: string;

	@IsNumberString({}, { message: 'O campo "cnpj" deve ser um número!' })
	@IsNotEmpty({ message: 'O campo "cnpj" deve ser preenchido!' })
	@Validate(IsValidCNPJ)
	@ValidateIf((o) => o.cnpj !== '00000000000000')
	cnpj: string;

	@Length(11, 11, { message: 'O campo "phone_number" deve conter 11 caracteres!' })
	@IsNumberString({}, { message: 'O campo "phone_number" deve ser um número!' })
	phone_number: string;

	@IsObject({ message: 'O campo "address" deve ser um objeto!' })
	@ValidateNested({ message: 'O campo "address" deve ser um objeto!' })
	@Type(() => Address)
	address: Address;

	@IsOptional()
	@IsObject({ message: 'O campo "companyPlan" deve ser um objeto!' })
	@ValidateNested({ message: 'O campo "companyPlan" deve ser um objeto!' })
	@Type(() => CompanyPlan)
	companyPlan?: CompanyPlan;
}
