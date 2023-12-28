import { translation } from '@/translations/_default'

export type TranslationFunc = (...args: string[]) => string

export type TranslationRaw = {
	[key: string]: string | TranslationFunc
}

type TranslationBuilder<TBase> = {
	readonly [TKey in keyof TBase]?: TBase[TKey] extends TranslationFunc
		? (...args: Parameters<TBase[TKey]>) => string
		: string
}

export type Translation = TranslationBuilder<typeof translation>

export type Translations = Record<string, () => Promise<Translation>>

export function createTranslation(translation: Translation): Translation {
	return translation
}

export const defaultTranslation = createTranslation(translation)
