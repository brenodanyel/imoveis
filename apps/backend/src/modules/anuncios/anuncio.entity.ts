export class AnuncioEntity {
	id: string;
	createdAt: string;
	expiresAt: string | null;

	titulo: string;
	descricao: string;
	proposito: string;
	thumbnail: string;

	area_total: number;
	area_construida: number;

	valor: number;
	valor_iptu: number;
	valor_condominio: number;

	subcategoria: string;

	endereco: {
		rua: string;
		numero: string;
		complemento: string;
		bairro: string;
		cidade: string;
		estado: string;
		pais: string;
		cep: string;
	};

	caracteristicas: Record<string, number>;

	comodidades: string[];

	imagens: {
		url: string;
	}[];

	constructor(input: any) {
		this.id = input.id;
		this.createdAt = input.createdAt;
		this.expiresAt = input.expiresAt || null;

		this.titulo = input.titulo;
		this.descricao = input.descricao;
		this.proposito = input.proposito;
		this.thumbnail = input.thumbnail;

		this.valor = input.valor;
		this.valor_iptu = input.valor_iptu;
		this.valor_condominio = input.valor_condominio;

		this.area_total = input.area_total;
		this.area_construida = input.area_construida;

		this.subcategoria = input.subcategoria;

		this.endereco = {
			rua: input.endereco.rua,
			numero: input.endereco.numero,
			complemento: input.endereco.complemento,
			bairro: input.endereco.bairro,
			cidade: input.endereco.cidade,
			estado: input.endereco.estado,
			pais: input.endereco.pais,
			cep: input.endereco.cep,
		};

		this.caracteristicas = input.caracteristicas.reduce((acc, caracteristica) => {
			acc[caracteristica.caracteristica.nome] = caracteristica.qty;
			return acc;
		}, {});

		this.comodidades = input.comodidades.map((comodidade) => comodidade.comodidade.nome);

		this.imagens = input.imagens.map((imagem) => ({ url: imagem.url }));
	}
}
