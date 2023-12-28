import { CodeDocuments } from '@/providers/CodeDocuments'
import { I18n } from '@/providers/I18n'
import { Icons } from '@/providers/Icons'
import { Portal } from '@/providers/Portal'
import { Theme } from '@/providers/Theme'
import { Root } from '@/routes/_Root'
import { Svg } from '@/routes/svg/_Svg'
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
				<Svg />
			</Match>
			<Match when={!route}>
				<I18n
					initialLanguage="_default"
					translations={translations}
				>
					<CodeDocuments>
						<Theme>
							<Portal mountIds={['modal', 'tooltip']}>
								<Icons>
									<div class={css.root}>
										<Root />
									</div>
								</Icons>
							</Portal>
						</Theme>
					</CodeDocuments>
				</I18n>
			</Match>
		</Switch>
	)
}
