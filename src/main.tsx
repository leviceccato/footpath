// Solid Refresh pragma
/* @refresh reload */

import 'modern-normalize/modern-normalize.css'
import '@/base.css'

import { render } from 'solid-js/web'
import { lastSegmentFromPath } from '@/scripts/utils'
import { parseToRgb } from 'polished'

import ProviderI18n from '@/components/ProviderI18n'
import ProviderTheme from '@/components/ProviderTheme'
import TheApp from '@/components/TheApp'

// Import translations and generate languageName -> importFunc map

import { defaultTranslation } from '@/scripts/i18n'
const translationModules = import.meta.glob(
	['@/translations/*.ts', '!**/_default.ts'],
	{ import: 'default' },
)

const translations = Object.keys(translationModules).reduce((result, path) => {
	const language = lastSegmentFromPath(path)
	result[language] = translationModules[path]
	return result
}, {})

// Initialise theme data

const initialBgColour = parseToRgb('#FFB885')

render(
	() => (
		<ProviderI18n
			defaultTranslation={defaultTranslation}
			translations={translations}
		>
			<ProviderTheme initialBgColour={initialBgColour}>
				<TheApp />
			</ProviderTheme>
		</ProviderI18n>
	),
	document.getElementById('root') as HTMLElement,
)
