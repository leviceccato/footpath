import {
	createContext,
	createSignal,
	useContext,
	onMount,
	onCleanup,
} from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { readableColor, mix, parseToRgb, hslToColorString } from 'polished'
import { colourDark, colourLight, colourBrand } from '@/data/colours'
import { createClientStore } from '@/utils/storage'
import type { HslaColor, HslColor } from 'polished/lib/types/color'
import type { ParentComponent } from 'solid-js'
import * as css from './ProviderTheme.css'

function createThemeContext() {
	const [colour, setColour] = createClientStore('colour', 1, colourBrand)
	const [useSystem, setUseSystem] = createClientStore('use-system', 1, {
		value: false,
	})

	const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)')
	const [prefersDark, setPrefersDark] = createSignal(prefersDarkMedia.matches)

	const _colour = () => {
		if (!useSystem.value) {
			return colour
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
		setColour(colour)
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
}

const context = createContext(createThemeContext())

export function useTheme() {
	return useContext(context)
}

const ProviderTheme: ParentComponent = (props) => {
	return (
		<context.Provider value={createThemeContext()}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderTheme
