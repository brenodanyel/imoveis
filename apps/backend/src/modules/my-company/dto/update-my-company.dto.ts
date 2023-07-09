import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsObject, IsOptional, Length, Validate, ValidateIf, ValidateNested } from 'class-validator';
import { Address, IsValidCNPJ } from '../../../utils/commons.validator';

export class UpdateMyCompanyDto {
	@IsOptional()
	@IsNotEmpty({ message: 'O campo "name" deve ser preenchido!' })
	@Length(1, 200, { message: 'O campo "name" deve conter entre 1 e 200 caracteres!' })
	name: string;

	@IsOptional()
	@IsNumberString({}, { message: 'O campo "cnpj" deve ser um número!' })
	@IsNotEmpty({ message: 'O campo "cnpj" deve ser preenchido!' })
	@Validate(IsValidCNPJ, { message: 'O campo "cnpj" deve ser válido!' })
	@ValidateIf((o) => o.cnpj !== '00000000000000', { message: 'O campo "cnpj" deve ser válido!' })
	cnpj: string;

	@IsOptional()
	@Length(11, 11, { message: 'O campo "phone_number" deve conter 11 caracteres!' })
	@IsNumberString({}, { message: 'O campo "phone_number" deve ser um número!' })
	phone_number: string;

	@IsOptional()
	@IsObject({ message: 'O campo "address" deve ser um objeto!' })
	@ValidateNested({ message: 'O campo "address" deve ser um objeto!' })
	@Type(() => Address)
	address: Address;
}
