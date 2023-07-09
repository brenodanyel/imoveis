import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParamsWithOnlyID } from '../../utils/commons.validator';
import { Auth, GuardRoute } from '../auth/auth.guard';
import { AuthPresenter } from '../auth/auth.presenter';
import { AttachExistingUserDto } from './dto/attach-existing-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateMyCompanyDto } from './dto/update-my-company.dto';
import { UpdateUsersRolesDto } from './dto/update-users-roles.dto';
import { MyCompanyService } from './my-company.service';

@Controller('my-company')
export class MyCompanyController {
	constructor(private readonly myCompanyService: MyCompanyService) {}

	@Get()
	@GuardRoute()
	getMyCompanyInfo(@Auth() auth: AuthPresenter) {
		return this.myCompanyService.getMyCompanyInfo(auth.user.company.id);
	}

	@Patch()
	@GuardRoute('my-company.update')
	updateMyCompanyInfo(@Auth() auth: AuthPresenter, @Body() updateMyCompanyDto: UpdateMyCompanyDto) {
		return this.myCompanyService.updateMyCompanyInfo(auth, updateMyCompanyDto);
	}

	@Get('users')
	@GuardRoute('my-company.users.list')
	listUsers(@Auth() auth: AuthPresenter, @Query() listUsersDto: ListUsersDto) {
		return this.myCompanyService.listUsers(auth.user.company.id, listUsersDto);
	}

	@Post('users')
	@GuardRoute('my-company.users.attach')
	createUser(@Auth() auth: AuthPresenter, @Body() createUserDto: CreateUserDto, @Req() req: Request) {
		return this.myCompanyService.cadastrarUsuario(auth, createUserDto, req.headers.origin);
	}

	@Delete('users/:id')
	@GuardRoute('my-company.users.remove')
	removeUser(@Auth() auth: AuthPresenter, @Param() params: ParamsWithOnlyID) {
		return this.myCompanyService.removeUser(auth.user.company.id, Number(params.id));
	}

	@Post('users/:id')
	@GuardRoute('my-company.users.attach')
	vincularUsuarioExistente(
		@Auth() auth: AuthPresenter,
		@Param() params: ParamsWithOnlyID,
		@Body() attachExistingUserDto: AttachExistingUserDto,
		@Req() req: Request,
	) {
		return this.myCompanyService.vincularUsuarioExistente(auth, Number(params.id), attachExistingUserDto, req.headers.origin);
	}

	@Get('users/:id/verify')
	@GuardRoute('my-company.users.attach')
	verificaSePodeVincularUsuario(@Auth() auth: AuthPresenter, @Param() params: ParamsWithOnlyID) {
		return this.myCompanyService.verificaSePodeVincularUsuario(auth, Number(params.id));
	}

	@Patch('users/:id')
	@GuardRoute('my-company.users.update-roles')
	updateUserRoles(@Auth() auth: AuthPresenter, @Param() params: ParamsWithOnlyID, @Body() updateUserRolesDto: UpdateUsersRolesDto) {
		return this.myCompanyService.updateUserRoles(auth, Number(params.id), updateUserRolesDto);
	}
}
