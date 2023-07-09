// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	pages: true,
	devtools: { enabled: true },
	css: ['bootstrap-icons/font/bootstrap-icons.css'],
	imports: {
		dirs: ['component-variants'],
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
