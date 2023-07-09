import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ParamsWithOnlyID } from '../../utils/commons.validator';
import { GuardRoute } from '../auth/auth.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@Post()
	@GuardRoute('company.create')
	create(@Body() createCompanyDto: CreateCompanyDto) {
		return this.companyService.create(createCompanyDto);
	}

	@Get()
	@GuardRoute('company.findAll')
	findAll(@Query() query: FindAllDto) {
		return this.companyService.findAll(query);
	}

	@Get(':id')
	@GuardRoute('company.findById')
	findOne(@Param() params: ParamsWithOnlyID) {
		return this.companyService.findOne(+params.id);
	}

	@Patch(':id')
	@GuardRoute()
	update(@Param() params: ParamsWithOnlyID, @Body() updateCompanyDto: UpdateCompanyDto) {
		return this.companyService.update(+params.id, updateCompanyDto);
	}

	@Delete(':id')
	@GuardRoute('company.remove')
	remove(@Param() params: ParamsWithOnlyID) {
		return this.companyService.remove(+params.id);
	}
}
