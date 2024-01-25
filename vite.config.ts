import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { type UserConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const src = new URL('./src', import.meta.url)
const dist = new URL('./dist', import.meta.url)

export default {
	root: src.pathname,
	clearScreen: false,
	publicDir: 'static',
	plugins: [solidPlugin(), vanillaExtractPlugin()],
	server: {
		host: true,
	},
	build: {
		outDir: dist.pathname,
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'@': src.pathname,
		},
	},
} satisfies UserConfig
