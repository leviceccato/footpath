// Solid Refresh pragma
/* @refresh reload */

import 'modern-normalize/modern-normalize.css'
import '@/base.css'

import { render } from 'solid-js/web'
import { lastSegmentFromPath } from '@/scripts/utils'

import I18n from '@/components/I18n'
import TheApp from '@/components/TheApp'

// Import translations

import { defaultTranslation } from '@/scripts/i18n'
const translationModules = import.meta.glob(
	['@/translations/*.ts', '!**/_default.ts'],
	{ import: 'default' },
)

// Generate language name to import map

const translations = Object.keys(translationModules).reduce((result, path) => {
	const language = lastSegmentFromPath(path)

	result[language] = translationModules[path]

	return result
}, {})

render(
	() => (
		<I18n
			defaultTranslation={defaultTranslation}
			translations={translations}
		>
			<TheApp />
		</I18n>
	),
	document.getElementById('root') as HTMLElement,
)
