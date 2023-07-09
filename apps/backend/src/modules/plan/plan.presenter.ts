export class PlanPresenter {
	id: number;
	name: string;
	price: number;
	public: boolean;
	active: boolean;

	limit_users: number;

	constructor(plan: any) {
		this.id = plan.id;
		this.name = plan.name;
		this.price = plan.price;
		this.public = plan.public;
		this.active = plan.active;

		this.limit_users = plan.limit_users;
	}
}
