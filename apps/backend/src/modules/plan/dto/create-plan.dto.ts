import { IsBoolean, IsNumber, IsOptional, Length, Min } from 'class-validator';

export class CreatePlanDto {
	@Length(3, 255, { message: 'O nome deve ter entre 3 e 255 caracteres!' })
	name: string;

	@IsNumber({}, { message: 'O preço deve ser um número!' })
	@Min(0, { message: 'O preço deve ser um número maior ou igual a 0!' })
	price: number;

	@IsOptional()
	@IsBoolean({ message: 'O campo "public" deve ser um booleano!' })
	public?: boolean;

	@IsNumber()
	@Min(0, { message: 'O limite de usuários deve ser um número maior ou igual a 0!' })
	limit_users: number;

	@IsOptional()
	@IsBoolean({ message: 'O campo "active" deve ser um booleano!' })
	active?: boolean;
}
