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
	return [{ vars }, setBgColour] as const
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

	function createBgLightnessVar(value: number): string {
		return String(bgColourHsl().lightness + value * lightnessDirection())
	}

	const theme = () => {
		return {
			vars: assignInlineVars({
				[css.bgColourHueVar]: String(bgColourHsl().hue),
				[css.bgColourSaturationVar]: String(bgColourHsl().saturation),
				[css.bgColourLightness0Var]: createBgLightnessVar(0),
				[css.bgColourLightness1Var]: createBgLightnessVar(0.1),
				[css.bgColourLightness2Var]: createBgLightnessVar(0.2),
				[css.bgColourLightness3Var]: createBgLightnessVar(0.3),
				[css.bgColourLightness4Var]: createBgLightnessVar(0.4),
				[css.bgColourLightness5Var]: createBgLightnessVar(0.5),
				[css.bgColourLightness6Var]: createBgLightnessVar(0.6),
				[css.bgColourLightness7Var]: createBgLightnessVar(0.7),
				[css.bgColourLightness8Var]: createBgLightnessVar(0.8),
				[css.bgColourLightness9Var]: createBgLightnessVar(0.9),
				[css.bgColourLightness10Var]: createBgLightnessVar(1),
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
