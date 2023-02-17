import { Router, Routes, Route } from '@solidjs/router'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'
import { lastSegmentFromPath } from '@/utils/misc'
import { parseToHsl } from 'polished'
import { colourBrand } from '@/data/colours'
import type { Translation, Translations } from '@/utils/i18n'
import ProviderI18n from '@/components/ProviderI18n'
import ProviderTheme from '@/components/ProviderTheme'
import ProviderIcons from '@/components/ProviderIcons'
import ProviderPortal from '@/components/ProviderPortal'
import RouteMain from '@/components/RouteMain'
import RouteSvg from '@/components/RouteSvg'

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

// Define portal mounts

const mountIds = ['modal', 'tooltip']

const TheApp: Component = () => {
	return (
		<ProviderI18n
			defaultLanguage="_default"
			translations={translations}
		>
			<ProviderTheme
				initialColour={colour}
				initialShouldUseSystem={shouldUseSystem}
			>
				<ProviderPortal mountIds={mountIds}>
					<ProviderIcons>
						<div class={css.root}>
							<Router>
								<Routes>
									<Route
										path="/"
										component={RouteMain}
									/>
									<Route
										path="/svg"
										component={RouteSvg}
									/>
								</Routes>
							</Router>
						</div>
					</ProviderIcons>
				</ProviderPortal>
			</ProviderTheme>
		</ProviderI18n>
	)
}

export default TheApp
