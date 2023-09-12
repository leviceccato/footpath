import { type UserConfig } from 'vite'
import { resolve } from 'path'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import solidPlugin from 'vite-plugin-solid'

export default {
	clearScreen: false,
	publicDir: 'src/static',
	plugins: [solidPlugin(), vanillaExtractPlugin()],
	server: {
		host: true,
	},
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
} satisfies UserConfig
