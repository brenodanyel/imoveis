import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParamsWithOnlyID } from '../../utils/commons.validator';
import { Auth, GuardRoute } from '../auth/auth.guard';
import { AuthPresenter } from '../auth/auth.presenter';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllDto } from './dto/find-all.dto';
import { FindByDto } from './dto/find-by.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@GuardRoute('user.create')
	create(@Body() createUserDto: CreateUserDto, @Auth() auth: AuthPresenter, @Req() req: Request) {
		return this.userService.create(createUserDto, auth, req.headers.origin);
	}

	@Get()
	@GuardRoute('user.findAll')
	findAll(@Query() query: FindAllDto) {
		return this.userService.findAll(query);
	}

	@Get('findBy')
	@GuardRoute()
	findBy(@Query() query: FindByDto) {
		return this.userService.findBy(query);
	}

	@Get(':id')
	@GuardRoute('user.findById')
	findOne(@Param() params: ParamsWithOnlyID) {
		return this.userService.findOne(+params.id);
	}

	@Patch(':id')
	@GuardRoute('user.update')
	update(@Param() params: ParamsWithOnlyID, @Body() updateUserDto: UpdateUserDto, @Auth() auth: AuthPresenter) {
		return this.userService.update(+params.id, updateUserDto, auth);
	}

	@Delete(':id')
	@GuardRoute('user.remove')
	remove(@Param() params: ParamsWithOnlyID) {
		return this.userService.remove(+params.id);
	}
}
