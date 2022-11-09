import translation from '@/translations/_default'

export type TranslationContent = typeof translation

export type Translation = {
	language: string
	content: TranslationContent
}

export function createTranslation(translation: Translation): Translation {
	return translation
}

export const defaultTranslation = createTranslation({
	language: 'template',
	content: translation,
})
