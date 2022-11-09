import {
	createContext,
	createSignal,
	useContext,
	createEffect,
	mergeProps,
} from 'solid-js'
import type { ParentComponent } from 'solid-js'
import type { Translation } from '@/scripts/i18n'

const context = createContext<Translation>()

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
		<context.Provider value={translation()}>{props.children}</context.Provider>
	)
}

export default I18n
