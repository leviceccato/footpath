import { Switch, Match } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'
import { lastSegmentFromPath } from '@/utils/misc'
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

// Parse search params to figure out if SVG or main view should be shown
const params = new URLSearchParams(window.location.search)
const route = params.has('svg') ? 'svg' : 'main'

const TheApp: Component = () => {
	return (
		<Switch>
			<Match when={route === 'svg'}>
				<RouteSvg />
			</Match>
			<Match when={route === 'main'}>
				<ProviderI18n
					defaultLanguage="_default"
					translations={translations}
				>
					<ProviderTheme>
						<ProviderPortal mountIds={['modal', 'tooltip']}>
							<ProviderIcons>
								<div class={css.root}>
									<RouteMain />
								</div>
							</ProviderIcons>
						</ProviderPortal>
					</ProviderTheme>
				</ProviderI18n>
			</Match>
		</Switch>
	)
}

export default TheApp
