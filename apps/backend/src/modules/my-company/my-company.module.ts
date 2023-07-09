import { Module } from '@nestjs/common';

import { MyCompanyService } from './my-company.service';

import { MyCompanyController } from './my-company.controller';
import { MyCompanyPlanModule } from './plan/my-company-plan.module';

@Module({
	controllers: [MyCompanyController],
	providers: [MyCompanyService],
	imports: [MyCompanyPlanModule],
})
export class MyCompanyModule {}
