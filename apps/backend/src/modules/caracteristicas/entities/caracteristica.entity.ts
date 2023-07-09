export class CaracteristicaEntity {
	id: string;
	nome: string;

	constructor(input: any) {
		this.id = input.id;
		this.nome = input.nome;
	}
}
