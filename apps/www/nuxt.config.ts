// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	pages: true,
	devtools: { enabled: false },
	css: ['bootstrap-icons/font/bootstrap-icons.css'],
	imports: {
		dirs: ['types'],
	},
	vite: {
		vue: {
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
