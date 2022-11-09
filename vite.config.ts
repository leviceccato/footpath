import { defineConfig } from 'vite'
import { resolve } from 'path'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
	root: 'src',
	clearScreen: false,
	plugins: [solidPlugin(), vanillaExtractPlugin()],
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
})
