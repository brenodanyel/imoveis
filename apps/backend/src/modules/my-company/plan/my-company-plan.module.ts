import { Module } from '@nestjs/common';

import { MyCompanyPlanService } from './my-company-plan.service';

import { MyCompanyPlanController } from './my-company-plan.controller';

@Module({
	controllers: [MyCompanyPlanController],
	providers: [MyCompanyPlanService],
})
export class MyCompanyPlanModule {}
