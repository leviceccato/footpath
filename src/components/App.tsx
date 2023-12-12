import { ProviderCodeDocuments } from '@/providers/CodeDocuments'
import { ProviderI18n } from '@/providers/I18n'
import { ProviderIcons } from '@/providers/Icons'
import { ProviderPortal } from '@/providers/Portal'
import { ProviderTheme } from '@/providers/Theme'
import { RouteMain } from '@/components/RouteMain'
import { RouteSvg } from '@/components/RouteSvg'
import { type Translation, type Translations } from '@/utils/i18n'
import { lastSegmentFromPath } from '@/utils/misc'
import { Match, Switch } from 'solid-js'
import { type Component } from 'solid-js'
import * as css from './App.css'

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
const route = params.get('route')

export const App: Component = () => {
	return (
		<Switch>
			<Match when={route === 'svg'}>
				<RouteSvg />
			</Match>
			<Match when={!route}>
				<ProviderI18n
					defaultLanguage="_default"
					translations={translations}
				>
					<ProviderCodeDocuments>
						<ProviderTheme>
							<ProviderPortal mountIds={['modal', 'tooltip']}>
								<ProviderIcons>
									<div class={css.root}>
										<RouteMain />
									</div>
								</ProviderIcons>
							</ProviderPortal>
						</ProviderTheme>
					</ProviderCodeDocuments>
				</ProviderI18n>
			</Match>
		</Switch>
	)
}