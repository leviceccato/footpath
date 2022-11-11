import translation from '@/translations/_default'

export type Translation = typeof translation

export type Translations = Record<string, () => Promise<Translation>>

export function createTranslation(translation: Translation): Translation {
	return translation
}

export const defaultTranslation = createTranslation(translation)
