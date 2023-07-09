import { BadRequestException, Controller, Get, HttpCode, Param, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { StripeService } from '../../../shared/stripe/stripe.service';
import { ParamsWithOnlyID } from '../../../utils/commons.validator';
import { Auth, GuardRoute } from '../../auth/auth.guard';
import { AuthPresenter } from '../../auth/auth.presenter';
import { MyCompanyPlanService } from './my-company-plan.service';

@Controller('my-company/plan')
export class MyCompanyPlanController {
	constructor(
		private readonly myCompanyPlanService: MyCompanyPlanService,
		private readonly stripeService: StripeService,
		private readonly configService: ConfigService,
	) {}

	@Get('verify/:id')
	@GuardRoute('my-company.plan.upgrade')
	verifyUpgrade(@Auth() auth: AuthPresenter, @Param() params: ParamsWithOnlyID) {
		return this.myCompanyPlanService.verifyPlanCosts(auth, params);
	}

	@Post('/upgrade/:id')
	@GuardRoute('my-company.plan.upgrade')
	@HttpCode(200)
	upgrade(@Auth() auth: AuthPresenter, @Param() params: ParamsWithOnlyID, @Req() req: Request) {
		return this.myCompanyPlanService.changePlan(auth, params, req.headers.origin);
	}

	@Post('/stripe/callback')
	@HttpCode(200)
	stripeCallback(@Req() request: RawBodyRequest<Request>) {
		try {
			const event = this.stripeService.webhooks.constructEvent(
				request.rawBody,
				request.headers['stripe-signature'],
				this.configService.getOrThrow<string>('STRIPE_ENDPOINT_SECRET'),
			);
			return this.myCompanyPlanService.stripeCallback(event);
		} catch (error) {
			console.log(error);
			throw new BadRequestException('Erro ao processar o pagamento.');
		}
	}
}
