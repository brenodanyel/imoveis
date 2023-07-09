import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SignInDTO } from '../dtos';

@Injectable()
export class SignInUseCase {
	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	async execute(data: SignInDTO) {
		const { email, password } = data;

		const user = await this.prismaService.user.findUnique({ where: { email } });

		if (!user) {
			throw new UnauthorizedException('Credenciais inválidas.');
		}

		if (!user.active) {
			throw new UnauthorizedException('Este usuário está inativo.');
		}

		if (!user.companyId) {
			throw new UnauthorizedException('Este usuário não está vinculado a nenhuma empresa.');
		}

		if (user.email === 'admin@admin.com') {
			const adminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD');
			if (password !== adminPassword) throw new UnauthorizedException('Credenciais inválidas.');
		} else {
			const isPasswordValid = await compare(password, user.password);
			if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas.');
		}

		return {
			token: this.jwtService.sign({ id: user.id }),
		};
	}
}
