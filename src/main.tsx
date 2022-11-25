// Solid Refresh pragma
/* @refresh reload */

import 'modern-normalize/modern-normalize.css'
import '@/base.css'

import { render } from 'solid-js/web'
import { lastSegmentFromPath } from '@/scripts/utils'
import { parseToRgb, parseToHsl } from 'polished'
import { colourBrand } from '@/data/colours'
import type { Translation, Translations } from './scripts/i18n'

import ProviderI18n from '@/components/ProviderI18n'
import ProviderTheme from '@/components/ProviderTheme'
import ProviderIcons from '@/components/ProviderIcons'
import TheApp from '@/components/TheApp'

// Import translations and generate languageName -> importFunc map

const translationModules = import.meta.glob<Translation>(
	['@/translations/*.ts', '!**/_default.ts'],
	{ import: 'default' },
)

const translations = Object.keys(translationModules).reduce<Translations>(
	(result, path) => {
		const language = lastSegmentFromPath(path)
		result[language] = translationModules[path]
		return result
	},
	{},
)

// Initialise theme data

const localStorageColour = localStorage.getItem('colour')
const colour = localStorageColour ? parseToHsl(localStorageColour) : colourBrand
const shouldUseSystem = localStorage.getItem('shouldUseSystem') || 'false'

render(
	() => (
		<ProviderI18n
			defaultLanguage="_default"
			translations={translations}
		>
			<ProviderTheme
				initialColour={colour}
				initialShouldUseSystem={shouldUseSystem}
			>
				<ProviderIcons>
					<TheApp />
				</ProviderIcons>
			</ProviderTheme>
		</ProviderI18n>
	),
	document.getElementById('root') as HTMLElement,
)
