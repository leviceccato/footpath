import { createContext, createSignal, useContext, createEffect } from 'solid-js'
import { defaultTranslation } from '@/utils/i18n'
import type { ParentComponent } from 'solid-js'
import type { Translation, Translations } from '@/utils/i18n'

function createI18nContext(
	initialTranslation: Translation,
	initialLanguage: string,
) {
	const [translation] = createSignal(initialTranslation)
	const [language, setLanguage] = createSignal(initialLanguage)
	return [translation, { get: language, set: setLanguage }] as const
}

const context = createContext(createI18nContext(defaultTranslation, '_default'))

export function useI18n() {
	return useContext(context)
}

const ProviderI18n: ParentComponent<{
	defaultLanguage: string
	translations?: Translations
}> = (props) => {
	const [translation, setTranslation] = createSignal(defaultTranslation)
	const [language, setLanguage] = createSignal(props.defaultLanguage)

	createEffect(async () => {
		if (language() === '_default' || !props.translations) {
			return setTranslation(defaultTranslation)
		}

		const newTranslationModule = props.translations[language()]
		if (!newTranslationModule) {
			console.warn(
				`Translation for language "${language()}" not found, using default.`,
			)
			return setTranslation(defaultTranslation)
		}

		const newTranslation = await newTranslationModule()
		setTranslation(newTranslation)
	})

	return (
		<context.Provider
			value={[translation, { get: language, set: setLanguage }]}
		>
			{props.children}
		</context.Provider>
	)
}

export default ProviderI18n
