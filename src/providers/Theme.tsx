import { colourBrand, colourDark, colourLight } from '@/data/colours'
import { useEventListener } from '@/utils/solid'
import { createClientStore } from '@/utils/storage'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { hslToColorString, mix, parseToRgb, readableColor } from 'polished'
import type { HslColor, HslaColor } from 'polished/lib/types/color'
import {
	type ParentComponent,
	createContext,
	createMemo,
	createRoot,
	createSignal,
	useContext,
} from 'solid-js'
import * as css from './Theme.css'

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

		useEventListener({
			target: prefersDarkMedia,
			eventName: 'change',
			listener: (event: MediaQueryListEvent) => {
				setPrefersDark(event.matches)
			},
		})

		const _colour = createMemo(() => {
			if (!useSystem().value) {
				return colour().value
			}
			if (prefersDark()) {
				return colourDark
			}
			return colourLight
		})

		const readable = createMemo(() =>
			readableColor(
				hslToColorString(_colour()),
				hslToColorString(colourDark),
				hslToColorString(colourLight),
			),
		)

		const isColourLight = () => readable() === hslToColorString(colourLight)

		function createColour(weight: number): string {
			const mixed = mix(weight, hslToColorString(_colour()), readable())
			const { red, green, blue } = parseToRgb(mixed)
			return [red, green, blue].join()
		}

		function _setColour(colour: HslColor | HslaColor) {
			setUseSystem({ value: false })
			setColour({ value: colour })
		}

		const theme = () => {
			return {
				colour: _colour,
				setColour: _setColour,
				useSystem,
				isColourLight,
				setUseSystem,
				class: css.colours,
				vars: assignInlineVars({
					[css.dpriUnitVar]: '1px',
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

export const Theme: ParentComponent = (props) => {
	return (
		<context.Provider value={themeContext}>{props.children}</context.Provider>
	)
}
