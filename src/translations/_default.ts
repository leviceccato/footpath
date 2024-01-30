import { type TranslationRaw } from '@/utils/i18n'

export const translation = {
	languageSetTo: (language: string) => `Set language to ${language}`,
	languageDefault: 'English',
	languageDefaultUntranslated: 'English',
	languageSpanish: 'Spanish',
	languageSpanishUntranslated: 'Español',
	code: 'Code',
	optimize: 'Optimize',
	svg: 'SVG',
	symbols: 'Symbols',
	data: 'Data',
	light: 'Light',
	dark: 'Dark',
	system: 'System',
	custom: 'Custom',
	untitled: 'Untitled',
	preferences: 'Preferences',
	about: 'About',
	close: 'Close',
	menu: 'Menu',
	documentNew: 'New document',
	preview: 'Preview',
} as const

/* Ensure translations type is correct */
const _translationsTypeCheck: TranslationRaw = translation
