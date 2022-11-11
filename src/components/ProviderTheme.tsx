import { createContext, createSignal, useContext, createEffect } from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { readableColor, parseToHsl, toColorString } from 'polished'
import type { RgbColor } from 'polished/lib/types/color'
import type { ParentComponent } from 'solid-js'
import * as css from './ProviderTheme.css'

// Function used purely to get return type for context

function createThemeContext(initialBgColour: RgbColor) {
	const [_, setBgColour] = createSignal(initialBgColour)
	const vars = assignInlineVars({})
	return [{ vars, class: css.colours }, setBgColour] as const
}

type ThemeContext = ReturnType<typeof createThemeContext>

const context = createContext<ThemeContext>()

export function useTheme() {
	return useContext(context)
}

const ProviderTheme: ParentComponent<{ initialBgColour: RgbColor }> = (
	props,
) => {
	const [bgColour, setBgColour] = createSignal(props.initialBgColour)

	const bgColourString = () => toColorString(bgColour())
	const bgColourHsl = () => parseToHsl(bgColourString())

	const readable = () => readableColor(bgColourString())
	const isColourLight = () => readable() === '#FFF'
	const lightnessDirection = () => (isColourLight() ? -1 : 1)

	function createLightnessVar(value: number): string {
		return String(bgColourHsl().lightness + value * lightnessDirection())
	}

	const theme = () => {
		return {
			class: css.colours,
			vars: assignInlineVars({
				[css.bgColourHueVar]: String(bgColourHsl().hue),
				[css.bgColourSaturationVar]: String(bgColourHsl().saturation),

				// Colour lightness values

				[css.colourLightness0Var]: createLightnessVar(1),
				[css.colourLightness1Var]: createLightnessVar(0.9),
				[css.colourLightness2Var]: createLightnessVar(0.8),
				[css.colourLightness3Var]: createLightnessVar(0.7),
				[css.colourLightness4Var]: createLightnessVar(0.6),
				[css.colourLightness5Var]: createLightnessVar(0.5),
				[css.colourLightness6Var]: createLightnessVar(0.4),
				[css.colourLightness7Var]: createLightnessVar(0.3),
				[css.colourLightness8Var]: createLightnessVar(0.2),
				[css.colourLightness9Var]: createLightnessVar(0.1),
				[css.colourLightness10Var]: createLightnessVar(0),
			}),
		}
	}

	return (
		<context.Provider value={[theme(), setBgColour]}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderTheme
