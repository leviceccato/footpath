import {
	createContext,
	createRoot,
	createSignal,
	useContext,
	onMount,
	onCleanup,
	type ParentComponent,
} from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { readableColor, mix, parseToRgb, hslToColorString } from 'polished'
import { colourDark, colourLight, colourBrand } from '@/data/colours'
import { createClientStore } from '@/utils/storage'
import { type HslaColor, type HslColor } from 'polished/lib/types/color'
import * as css from './ProviderTheme.css'

function createThemeContext() {
	return createRoot(() => {
		const [colour, setColour] = createClientStore({
			name: 'colour',
			version: 1,
			initialValue: colourBrand,
		})
		const [useSystem, setUseSystem] = createClientStore({
			name: 'use-system',
			version: 1,
			initialValue: false,
		})

		const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)')
		const [prefersDark, setPrefersDark] = createSignal(prefersDarkMedia.matches)

		const _colour = () => {
			if (!useSystem().value) {
				return colour().value
			}
			if (prefersDark()) {
				return colourDark
			}
			return colourLight
		}

		const readable = () =>
			readableColor(
				hslToColorString(_colour()),
				hslToColorString(colourDark),
				hslToColorString(colourLight),
			)

		const isColourLight = () => readable() === hslToColorString(colourLight)

		function createColour(weight: number): string {
			const mixed = mix(weight, hslToColorString(_colour()), readable())
			const { red, green, blue } = parseToRgb(mixed)
			return [red, green, blue].join()
		}

		function handleMediaChange(event: MediaQueryListEvent) {
			setPrefersDark(event.matches)
		}

		function _setColour(colour: HslColor | HslaColor) {
			setUseSystem({ value: false })
			setColour({ value: colour })
		}

		onMount(() => {
			prefersDarkMedia.addEventListener('change', handleMediaChange)
		})

		onCleanup(() => {
			prefersDarkMedia.removeEventListener('change', handleMediaChange)
		})

		const theme = () => {
			return {
				colour: _colour,
				setColour: _setColour,
				useSystem,
				isColourLight,
				setUseSystem,
				class: css.colours,
				vars: assignInlineVars({
					[css.colourBaseVar]: createColour(1),
					[css.colourBase50Var]: createColour(0.95),
					[css.colourBase100Var]: createColour(0.9),
					[css.colourBase150Var]: createColour(0.85),
					[css.colourBase200Var]: createColour(0.8),
					[css.colourBase300Var]: createColour(0.7),
					[css.colourBase400Var]: createColour(0.6),
					[css.colourBase500Var]: createColour(0.5),
					[css.colourBase600Var]: createColour(0.4),
					[css.colourBase700Var]: createColour(0.3),
					[css.colourBase800Var]: createColour(0.2),
					[css.colourBase900Var]: createColour(0.1),
					[css.colourBase1000Var]: createColour(0),
				}),
			}
		}

		return [theme] as const
	})
}

const themeContext = createThemeContext()
const context = createContext(themeContext)

export function useTheme() {
	return useContext(context)
}

export const ProviderTheme: ParentComponent = (props) => {
	return (
		<context.Provider value={themeContext}>{props.children}</context.Provider>
	)
}

export default ProviderTheme
