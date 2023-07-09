import { UserPresenter } from '../user/user.presenter';

export class AuthPresenter {
	user: UserPresenter;
	roles: {
		id: number;
		name: string;
		slug: string;
	}[];

	constructor(input: any) {
		this.user = new UserPresenter(input.user);
		this.roles = input.roles;
	}
}
