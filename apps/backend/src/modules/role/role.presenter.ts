export class RolePresenter {
	id: number;
	name: string;
	slug: string;

	constructor(role: any) {
		this.id = role.id;
		this.name = role.name;
		this.slug = role.slug;
	}
}
