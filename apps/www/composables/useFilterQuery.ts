import { Filtro } from '../types/anuncios';

export default function useFilterQuery() {
	const { $router } = useNuxtApp();

	function syncURL(filter: Filtro) {
		const { comodidades, max_valor, min_valor, proposito, subcategorias } = filter;

		if ($router.currentRoute.value.path === '/') return;

		$router.push({
			path: $router.currentRoute.value.path,
			query: {
				...$router.currentRoute.value.query,
				comodidades: comodidades.join(',') || undefined,
				max_valor: max_valor || undefined,
				min_valor: min_valor || undefined,
				proposito: proposito || undefined,
				subcategorias: subcategorias.join(',') || undefined,
			},
		});
	}

	function parseURL(defaultValue: Filtro): Filtro {
		const { comodidades, max_valor, min_valor, proposito, subcategorias } = $router.currentRoute.value.query;

		return {
			comodidades: comodidades ? (comodidades as string).split(',').map(Number) : defaultValue.comodidades,
			max_valor: max_valor ? Number(max_valor) : defaultValue.max_valor,
			min_valor: min_valor ? Number(min_valor) : defaultValue.min_valor,
			proposito: proposito ? (proposito as string) : defaultValue.proposito,
			subcategorias: subcategorias ? (subcategorias as string).split(',').map(Number) : defaultValue.subcategorias,
		};
	}

	return { syncURL, parseURL };
}
