import { createContext, createSignal, useContext, createEffect } from 'solid-js'
import { defaultTranslation } from '@/scripts/i18n'
import type { ParentComponent } from 'solid-js'
import type { Translation } from '@/scripts/i18n'

// Function used purely to get return type for context

function createI18nContext(
	initialTranslation: Translation,
	initialLanguage: string,
) {
	const [translation] = createSignal(initialTranslation)
	const [language, setLanguage] = createSignal(initialLanguage)
	return [translation, { get: language, set: setLanguage }] as const
}

type I18nContext = ReturnType<typeof createI18nContext>

const context = createContext<I18nContext>(
	createI18nContext(defaultTranslation, '_default'),
)

export function useI18n() {
	return useContext(context)
}

const ProviderI18n: ParentComponent<{
	defaultTranslation: Translation
	translations?: Record<string, () => Promise<Translation>>
}> = (props) => {
	const [translation, setTranslation] = createSignal(props.defaultTranslation)
	const [language, setLanguage] = createSignal('_default')

	createEffect(async () => {
		if (language() === '_default' || !props.translations) {
			return setTranslation(props.defaultTranslation)
		}

		const newTranslationModule = props.translations[language()]
		if (!newTranslationModule) {
			console.warn(
				`Translation for language "${language()}" not found, using default.`,
			)
			return setTranslation(props.defaultTranslation)
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
