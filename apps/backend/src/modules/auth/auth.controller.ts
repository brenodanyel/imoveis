import { Request } from 'express';

import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';

import * as DTOs from './dtos';
import * as UseCases from './usecases';

import { Auth, GuardRoute } from './auth.guard';
import { AuthPresenter } from './auth.presenter';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly signInUseCase: UseCases.SignInUseCase,
		private readonly signUpUseCase: UseCases.SignUpUseCase,
		private readonly switchCompanyUseCase: UseCases.SwitchCompanyUseCase,
		private readonly confirmAccountUseCase: UseCases.ConfirmAccountUseCase,
		private readonly acceptInviteToCompanyUseCase: UseCases.AcceptInviteToCompanyUseCase,
		private readonly acceptInviteAndActivateAccountUseCase: UseCases.AcceptInviteAndActivateAccountUseCase,
	) {}

	@Post('login')
	@HttpCode(200)
	signIn(@Body() data: DTOs.SignInDTO) {
		return this.signInUseCase.execute(data);
	}

	@Post('register')
	signUp(@Body() signUpDto: DTOs.SignUpDTO, @Req() req: Request) {
		return this.signUpUseCase.execute(signUpDto, req.headers.origin);
	}

	@Post('confirm-account')
	confirmAccount(@Body() data: DTOs.ConfirmAccountDTO) {
		return this.confirmAccountUseCase.execute(data);
	}

	@Post('accept-invite-and-activate-account')
	acceptInviteAndActivateAccount(@Body() data: DTOs.AcceptInviteAndActivateAccountUseCaseDTO) {
		return this.acceptInviteAndActivateAccountUseCase.execute(data);
	}

	@Post('accept-invite-to-company')
	acceptInviteToCompany(@Body() data: DTOs.AcceptInviteToCompanyDTO) {
		return this.acceptInviteToCompanyUseCase.execute(data);
	}

	@Post('switch-company')
	@GuardRoute()
	@HttpCode(200)
	switchCompany(@Auth() auth: AuthPresenter, @Body() data: DTOs.SwitchCompanyDTO) {
		return this.switchCompanyUseCase.execute(auth, data);
	}
}
