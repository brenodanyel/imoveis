import { api } from './api';

export function isMainCompany(company: any) {
	return company?.cnpj === '00000000000000';
}

export function formatCurrency(value: number) {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// todo: fazer salvar no banco o cnpj sem formatação
export function formatCNPJ(value: string) {
	return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatCPF(value: string) {
	return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export async function buscarCep(cep: string) {
	return api.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
}

export async function buscarCNPJ(cnpj: string) {
	return api.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
}

export function selectFile(params = { multiple: false, accept: '*' }): Promise<Blob | Blob[] | null> {
	return new Promise((resolve) => {
		let input = document.createElement('input');
		input.type = 'file';
		input.multiple = params.multiple;
		input.accept = params.accept;

		input.onchange = () => {
			if (!input.files) return;

			const files = Array.from(input.files);

			if (params.multiple) {
				resolve(files);
				return;
			}

			resolve(files[0]);
		};

		input.click();
	});
}
