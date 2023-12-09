import { ProviderCodeDocuments } from '@/components/ProviderCodeDocuments'
import { ProviderI18n } from '@/components/ProviderI18n'
import { ProviderIcons } from '@/components/ProviderIcons'
import { ProviderPortal } from '@/components/ProviderPortal'
import { ProviderTheme } from '@/components/ProviderTheme'
import { RouteMain } from '@/components/RouteMain'
import { RouteSvg } from '@/components/RouteSvg'
import { type Translation, type Translations } from '@/utils/i18n'
import { lastSegmentFromPath } from '@/utils/misc'
import { Match, Switch } from 'solid-js'
import { type Component } from 'solid-js'
import * as css from './TheApp.css'

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

export const TheApp: Component = () => {
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
