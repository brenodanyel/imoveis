import { Controller, Get, Query } from '@nestjs/common';
import { Auth, GuardRoute } from '../auth/auth.guard';
import { AuthPresenter } from '../auth/auth.presenter';
import { FindAllDto } from './dto/find-all.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
	constructor(private readonly rolesService: RoleService) {}

	@Get()
	@GuardRoute()
	findAll(@Auth() auth: AuthPresenter, @Query() query: FindAllDto) {
		return this.rolesService.findAll(auth, query);
	}
}
