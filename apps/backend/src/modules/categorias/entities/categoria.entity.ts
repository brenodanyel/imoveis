export class CategoriaEntity {
	id: string;
	nome: string;
	subcategorias: { id: string; nome: string }[];

	constructor(input: any) {
		this.id = input.id;
		this.nome = input.nome;

		this.subcategorias =
			input.subcategorias?.map((subcategoria) => ({
				id: subcategoria.id,
				nome: subcategoria.nome,
			})) || [];
	}
}
