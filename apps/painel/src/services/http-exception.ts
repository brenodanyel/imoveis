import { Notify } from 'quasar';

export function HttpException(data: any) {
	if (Array.isArray(data.message)) {
		data.message = data.message.join('<br>');
	}

	Notify.create({
		message: data.message || 'Erro desconhecido!',
		type: 'negative',
		html: true,
	});
}
