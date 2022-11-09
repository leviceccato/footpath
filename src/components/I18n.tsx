import {
	createContext,
	createSignal,
	useContext,
	createEffect,
	mergeProps,
} from 'solid-js'
import type { ParentComponent } from 'solid-js'
import type { Translation } from '@/scripts/i18n'

function createI18nContext(initialTranslation: Translation) {
	const [translation, setTranslation] = createSignal(initialTranslation)
	return [translation, setTranslation] as const
}

type I18nContext = ReturnType<typeof createI18nContext>

const context = createContext<I18nContext>()

export function useI18n() {
	return useContext(context)
}

const I18n: ParentComponent<{
	language?: string
	defaultTranslation: Translation
	translations?: Record<string, () => Promise<Translation>>
}> = (props) => {
	const _props = mergeProps({ language: '_default' }, props)

	const [translation, setTranslation] = createSignal(_props.defaultTranslation)

	createEffect(async () => {
		if (_props.language === '_default') {
			return setTranslation(_props.defaultTranslation)
		}

		const newTranslationModule = _props.translations[_props.language]
		if (!newTranslationModule) {
			console.warn(
				`Translation for language "${_props.language}" not found, using default.`,
			)
			return setTranslation(_props.defaultTranslation)
		}

		const newTranslation = await newTranslationModule()
		setTranslation(newTranslation)
	})

	return (
		<context.Provider value={[translation, setTranslation]}>
			{props.children}
		</context.Provider>
	)
}

export default I18n
