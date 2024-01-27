import {
	type Translation,
	type TranslationFunc,
	type Translations,
	defaultTranslation,
} from '@/utils/i18n'
import {
	type ParentComponent,
	createContext,
	createEffect,
	createRoot,
	createSignal,
	useContext,
} from 'solid-js'

function createI18nContext(
	initialLanguage: string,
	translations?: Translations,
) {
	return createRoot(() => {
		const [translation, setTranslation] = createSignal(defaultTranslation)
		const [language, setLanguage] = createSignal(initialLanguage)

		createEffect(async () => {
			if (language() === '_default' || !translations) {
				return setTranslation(defaultTranslation)
			}

			const newTranslationModule = translations[language()]
			if (!newTranslationModule) {
				console.warn(
					`Translation for language "${language()}" not found, using default.`,
				)
				return setTranslation(defaultTranslation)
			}

			const newTranslation = await newTranslationModule()
			setTranslation(newTranslation)
		})

		function translate<
			TKey extends keyof Translation,
			TValue extends NonNullable<Translation[TKey]>,
		>(
			key: TKey,
			...args: TValue extends TranslationFunc ? Parameters<TValue> : never[]
		): string {
			const trans = translation()
			const value = trans[key]
			if (typeof value === 'string') {
				return value
			}
			if (value) {
				// @ts-expect-error Unsure what's going on here
				return value(...args)
			}
			const defaultValue = defaultTranslation[key]
			if (typeof defaultValue === 'string') {
				return defaultValue
			}
			// @ts-expect-error Unsure what's going on here
			return defaultValue(...args)
		}

		return [translate, { get: language, set: setLanguage }] as const
	})
}

const context = createContext(createI18nContext('_default'))

export function useI18n() {
	return useContext(context)
}

export const I18n: ParentComponent<{
	initialLanguage: string
	translations?: Translations
}> = (props) => {
	return (
		<context.Provider
			value={createI18nContext(props.initialLanguage, props.translations)}
		>
			{props.children}
		</context.Provider>
	)
}
