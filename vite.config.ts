import { defineConfig } from 'vite'
import { resolve } from 'path'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
	root: 'src',
	clearScreen: false,
	plugins: [solidPlugin(), vanillaExtractPlugin()],
	server: {
		host: true,
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
})
