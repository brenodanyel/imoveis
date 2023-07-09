export interface PaginatedResult<T> {
	data: T[];
	meta: {
		rowsNumber: number;
		lastPage: number;
		currentPage: number;
		rowsPerPage: number;
		prev: number | null;
		next: number | null;
	};
}

export type PaginateOptions = {
	page?: number | string;
	rowsPerPage?: number | string;
	sortBy?: string;
	descending?: boolean | string;
};

export type PaginateFunction = <T, K>(model: any, args?: K, options?: PaginateOptions) => Promise<PaginatedResult<T>>;

export const paginator = (defaultOptions: PaginateOptions): PaginateFunction => {
	return async (model, args: any = { where: undefined }, options) => {
		const page = Number(options?.page || defaultOptions?.page) || 1;

		const rowsPerPage = Number(options?.rowsPerPage || defaultOptions?.rowsPerPage) || 10;

		const sortBy = options?.sortBy;
		const descending = options?.descending ? String(options.descending) === 'true' : undefined;

		const skip = page > 0 ? rowsPerPage * (page - 1) : 0;

		const [rowsNumber, data] = await Promise.all([
			model.count({ where: args.where }),
			model.findMany({
				...args,
				take: rowsPerPage,
				skip,
				orderBy: sortBy ? { [sortBy]: descending ? 'desc' : 'asc' } : undefined,
			}),
		]);

		const lastPage = Math.ceil(rowsNumber / rowsPerPage);

		return {
			data,
			meta: {
				rowsNumber,
				lastPage,
				currentPage: page,
				rowsPerPage,
				prev: page > 1 ? page - 1 : null,
				next: page < lastPage ? page + 1 : null,
			},
		};
	};
};

export const paginate: PaginateFunction = paginator({ rowsPerPage: 10 });
