import {
	createContext,
	createSignal,
	useContext,
	createEffect,
	mergeProps,
} from 'solid-js'
import type { ParentComponent } from 'solid-js'
import type { Translation } from '@/scripts/i18n'

// Function used purely to get return type for context

function createI18nContext(
	initialTranslation: Translation,
	initialLanguage: string,
) {
	const [translation] = createSignal(initialTranslation)
	const [_, setLanguage] = createSignal(initialLanguage)
	return [translation, setLanguage] as const
}

type I18nContext = ReturnType<typeof createI18nContext>

const context = createContext<I18nContext>()

export function useI18n() {
	return useContext(context)
}

const I18n: ParentComponent<{
	defaultTranslation: Translation
	translations?: Record<string, () => Promise<Translation>>
}> = (props) => {
	const [translation, setTranslation] = createSignal(props.defaultTranslation)
	const [language, setLanguage] = createSignal('_default')

	createEffect(async () => {
		console.log('getting here', language(), translation())
		if (language() === '_default') {
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
		<context.Provider value={[translation, setLanguage]}>
			{props.children}
		</context.Provider>
	)
}

export default I18n
