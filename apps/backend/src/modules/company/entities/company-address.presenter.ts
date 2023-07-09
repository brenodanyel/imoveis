export class CompanyAddressPresenter {
	street: string;
	number: string;
	complement: string;
	district: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;

	constructor(address: any) {
		this.street = address.street;
		this.number = address.number;
		this.complement = address.complement;
		this.district = address.district;
		this.city = address.city;
		this.state = address.state;
		this.country = address.country;
		this.zipCode = address.zipCode;
	}
}
