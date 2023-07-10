export type Anuncio = {
	id: number;
	createdAt: string;
	expiresAt: string | null;
	titulo: string;
	descricao: string;
	proposito: string;
	thumbnail: string;
	valor: number;
	valor_iptu: number;
	valor_condominio: number;
	area_total: number;
	area_construida: number;
	subcategoria: {
		id: number;
		nome: string;
		categoriaId: number;
	};
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
	imagens: { url: string }[];
};

export type Filtro = {
	proposito: string | null;
	subcategorias: number[];
	min_valor: number | null;
	max_valor: number | null;
	comodidades: number[];
};
