import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { type UserConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const src = new URL('./src', import.meta.url)

export default {
	clearScreen: false,
	publicDir: 'src/static',
	plugins: [solidPlugin(), vanillaExtractPlugin()],
	server: {
		host: true,
	},
	resolve: {
		alias: {
			'@': src.pathname,
		},
	},
} satisfies UserConfig
