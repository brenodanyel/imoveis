import { PlanPresenter } from '../../plan/plan.presenter';

export class CompanyPlanPresenter {
	paidAt: string;
	expiresAt: string;
	plan?: PlanPresenter | null;

	constructor(input: any) {
		this.paidAt = input.paidAt;
		this.expiresAt = input.expiresAt;

		this.plan = input.plan ? new PlanPresenter(input.plan) : null;
	}
}
