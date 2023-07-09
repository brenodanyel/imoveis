import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Auth, GuardRoute } from '../auth/auth.guard';
import { AuthPresenter } from '../auth/auth.presenter';
import { CreatePlanDto } from './dto/create-plan.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
	constructor(private readonly planService: PlanService) {}

	@Post()
	@GuardRoute('plan.create')
	create(@Body() createPlanDto: CreatePlanDto) {
		return this.planService.create(createPlanDto);
	}

	@Get()
	@GuardRoute('plan.findAll')
	findAll(@Auth() auth: AuthPresenter, @Query() query: FindAllDto) {
		return this.planService.findAll(auth, query);
	}

	@Get(':id')
	@GuardRoute('plan.findById')
	findOne(@Param('id') id: string) {
		return this.planService.findOne(+id);
	}

	@Patch(':id')
	@GuardRoute('plan.update')
	update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
		return this.planService.update(+id, updatePlanDto);
	}

	@Delete(':id')
	@GuardRoute('plan.remove')
	remove(@Param('id') id: string) {
		return this.planService.remove(+id);
	}
}
