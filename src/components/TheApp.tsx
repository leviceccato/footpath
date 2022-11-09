import type { Component } from 'solid-js'
import * as css from './TheApp.css'
import { lastSegmentFromPath } from '@/scripts/utils'

import I18n from '@/components/I18n'
import Button from '@/components/Button'

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

const App: Component = () => {
	return (
		<I18n
			defaultTranslation={defaultTranslation}
			translations={translations}
		>
			<div class={css.root}>
				<header class={css.header}>
					<div class={css.logoContainer}>
						<Button>Hello</Button>
					</div>
				</header>
			</div>
		</I18n>
	)
}

export default App
