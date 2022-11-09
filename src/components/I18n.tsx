import { createContext, useContext } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { defaultTranslation } from '@/utils/i18n'
import type { Translation, TranslationContent } from '@/utils/i18n'

const defaultContext = {
	t: defaultTranslation.content,
}

const context = createContext(defaultContext)

export function useI18n() {
	return useContext(context)
}

type LazyTranslation = () => Promise<Translation>

const I18n: ParentComponent<{
	translations: Record<string, Translation | LazyTranslation>
}> = (props) => {
	return (
		<context.Provider value={defaultContext}>{props.children}</context.Provider>
	)
}

export default I18n
