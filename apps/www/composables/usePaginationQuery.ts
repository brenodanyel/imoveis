export default function usePaginationQuery() {
	const { $router } = useNuxtApp();

	type Pagination = {
		sortBy: string;
		descending: boolean;
		page: number;
		rowsPerPage: number;
	};

	function syncURL(pagination: Pagination) {
		const { sortBy, descending, page, rowsPerPage } = pagination;

		if ($router.currentRoute.value.path === '/') return;

		$router.push({
			path: $router.currentRoute.value.path,
			query: {
				...$router.currentRoute.value.query,
				descending: descending ? 'desc' : 'asc',
				sortBy,
				page,
			},
		});
	}

	function parseURL(defaultValue: Pagination): Pagination {
		const query = $router.currentRoute.value.query;

		return {
			sortBy: (query.sortBy || defaultValue.sortBy) as string,
			descending: query.descending === undefined ? defaultValue.descending : query.descending === 'desc',
			page: parseInt((query.page || defaultValue.page) as string),
			rowsPerPage: Math.min(100, parseInt((query.rowsPerPage || defaultValue.rowsPerPage) as string)),
		};
	}

	return { syncURL, parseURL };
}
