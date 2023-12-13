import { createTranslation } from '@/utils/i18n'

export default createTranslation({
	language: {
		setTo: (language: string) => `Establecer idioma en ${language}`,
		all: {
			_default: {
				_: 'Inglés',
				untranslated: 'English',
			},
			spanish: {
				_: 'Español',
				untranslated: 'Español',
			},
		},
	},
	code: 'Código',
	optimize: 'Optimizar',
	svg: 'SVG',
	symbols: 'Simbolos',
	data: 'Datos',
	light: 'Ligero',
	dark: 'Oscuro',
	system: 'Sistema',
	custom: 'Personalizado',
	untitled: 'Intitulado',
	preferences: 'Preferencias',
	about: 'Sobre',
	close: 'Cerrar',
	menu: 'Menú',
	document: {
		new: 'Nuevo documento',
	},
	preview: 'Previsualizar',
})
