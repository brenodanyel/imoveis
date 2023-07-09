import { createPinia } from 'pinia';
import { App } from 'vue';

export function setup(app: App) {
	const pinia = createPinia();
	app.use(pinia);
}

export * from './auth.store';
export * from './app.store';
