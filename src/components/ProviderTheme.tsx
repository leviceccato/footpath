import { createContext, createSignal, useContext, createEffect } from 'solid-js'
import { readableColor, parseToHsl, toColorString } from 'polished'
import type { RgbColor } from 'polished/lib/types/color'
import type { ParentComponent } from 'solid-js'

// Function used purely to get return type for context

function createThemeContext(initialColour: RgbColor) {
	const [_, setColour] = createSignal(initialColour)
	return [setColour] as const
}

type ThemeContext = ReturnType<typeof createThemeContext>

const context = createContext<ThemeContext>()

export function useTheme() {
	return useContext(context)
}

const ProviderTheme: ParentComponent<{ initialColour: RgbColor }> = (props) => {
	const [colour, setColour] = createSignal(props.initialColour)

	const colourString = () => toColorString(colour())
	const readable = () => readableColor(colourString())
	const colourHsl = () => parseToHsl(colourString())

	return (
		<context.Provider value={[setColour]}>{props.children}</context.Provider>
	)
}

export default ProviderTheme
