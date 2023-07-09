export type Anuncio = {
	id: number;
	createdAt: string;
	expiresAt: string | null;
	titulo: string;
	descricao: string;
	thumbnail?: string;
	proposito: string;
	valor: number;
	valor_iptu: number;
	valor_condominio: number;
	area_total: number;
	area_construida: number;
	subcategoria: {
		id?: number;
		nome?: string;
		categoriaId?: number;
	};
	endereco: {
		rua: string;
		numero: string;
		complemento: string | null;
		bairro: string;
		cidade: string;
		estado: string;
		pais: string;
		cep: string;
	};
	caracteristicas: Record<string, number>;
	comodidades: string[];
	imagens: { url: string }[];
};

export type Comodidade = {
	id: number;
	nome: string;
};

export type Caracteristica = {
	id: number;
	nome: string;
};

export type Categoria = {
	id: number;
	nome: string;

	subcategorias: {
		id: number;
		nome: string;
	}[];
};
