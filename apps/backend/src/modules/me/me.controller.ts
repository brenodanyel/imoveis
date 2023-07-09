import { Body, Controller, Get, Patch } from '@nestjs/common';

import { MeService } from './me.service';

import { Auth, GuardRoute } from '../auth/auth.guard';
import { AuthPresenter } from '../auth/auth.presenter';
import { UpdateMyUserDto } from './dto/update-my-user.dto';

@Controller('me')
export class MeController {
	constructor(private readonly meService: MeService) {}

	@Get()
	@GuardRoute()
	me(@Auth() auth: AuthPresenter) {
		return auth;
	}

	@Patch()
	@GuardRoute()
	updateMyUser(@Auth() auth: AuthPresenter, @Body() updateMyUserDto: UpdateMyUserDto) {
		return this.meService.updateMyUser(auth.user.id, updateMyUserDto);
	}

	@Get('companies')
	@GuardRoute()
	listMyCompanies(@Auth() auth: AuthPresenter) {
		return this.meService.listMyCompanies(auth.user.id);
	}
}
