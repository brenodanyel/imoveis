import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
	IsBooleanString,
	IsInt,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	Length,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

export class ParamsWithOnlyID {
	@IsInt()
	@Type(() => Number)
	id: number;
}

export class Pagination {
	@IsString()
	@IsOptional()
	sortBy?: string;

	@IsBooleanString()
	@IsOptional()
	descending?: string;

	@IsNumberString()
	@IsOptional()
	page?: number;

	@IsNumberString()
	@IsOptional()
	rowsPerPage?: number;

	@IsNumberString()
	@IsOptional()
	rowsNumber?: number;
}

export class Address {
	@IsNotEmpty()
	@Length(1, 200)
	street: string;

	@IsNotEmpty()
	@Length(1, 100)
	@IsNumberString()
	number: string;

	@Length(0, 200)
	@IsOptional()
	complement?: string;

	@IsNotEmpty()
	@Length(1, 200)
	district: string;

	@IsNotEmpty()
	@Length(1, 200)
	city: string;

	@IsNotEmpty()
	@Length(1, 200)
	state: string;

	@IsNotEmpty()
	@Length(1, 200)
	country: string;

	@IsNotEmpty()
	@Length(1, 200)
	zipCode: string;
}

export class EnderecoDTO {
	@IsNotEmpty()
	@Length(1, 200)
	rua: string;

	@IsNotEmpty()
	@Length(1, 100)
	@IsNumberString()
	numero: string;

	@Length(0, 200)
	@IsOptional()
	complemento?: string;

	@IsNotEmpty()
	@Length(1, 200)
	bairro: string;

	@IsNotEmpty()
	@Length(1, 200)
	cidade: string;

	@IsNotEmpty()
	@Length(1, 200)
	estado: string;

	@IsNotEmpty()
	@Length(1, 200)
	pais: string;

	@IsNotEmpty()
	@Length(1, 200)
	cep: string;
}

@ValidatorConstraint()
export class IsValidCNPJ implements ValidatorConstraintInterface {
	validate(text: string) {
		return cnpj.isValid(text);
	}

	defaultMessage() {
		return 'cnpj is invalid';
	}
}

@ValidatorConstraint()
export class IsValidCPF implements ValidatorConstraintInterface {
	validate(text: string) {
		return cpf.isValid(text);
	}

	defaultMessage() {
		return 'cpf is invalid';
	}
}

export type FileTypeValidatorOptions = {
	fileType: string | RegExp;
	message?: string;
};

export class ValidateFileType extends FileTypeValidator {
	private readonly fileType = /\image\/(jpg|jpeg|png|gif)$/i;
	private readonly errorMessage: string = 'Formato do arquivo inválido';

	constructor(options: FileTypeValidatorOptions) {
		super({ fileType: options.fileType });

		if (options.message) {
			this.errorMessage = options.message;
		}
	}

	buildErrorMessage() {
		return this.errorMessage;
	}

	isValid(file: { mimetype: string; size: number }) {
		if (typeof this.fileType === 'string') {
			return file.mimetype === this.fileType;
		}

		return this.fileType.test(file.mimetype);
	}
}

export type MaxFileSizeValidatorOptions = {
	maxSize: number;
	message?: string | ((maxSize: number) => string);
};

export class ValidateFileMaxSize extends MaxFileSizeValidator {
	constructor(options: MaxFileSizeValidatorOptions) {
		super(options);
	}
}
