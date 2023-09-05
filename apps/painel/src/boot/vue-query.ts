import { App } from 'vue';
import { VueQueryPlugin } from 'vue-query';

export function setup(app: App) {
	app.use(VueQueryPlugin, {
		queryClientConfig: {
			defaultOptions: {
				queries: {
					cacheTime: 1000 * 60 * 2,
				},
			},
		},
	});
}
