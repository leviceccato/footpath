import { createContext, createSignal, useContext } from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { readableColor, mix, parseToRgb } from 'polished'
import { colourDark, colourLight } from '@/data/colours'
import type { Styles } from 'polished/lib/types/style'
import type { ParentComponent } from 'solid-js'
import * as css from './ProviderTheme.css'

function createThemeContext() {
	const [colour, _] = createSignal('')
	const [shouldUseSystem, __] = createSignal(false)
	const setColour = (to: string) => {}
	const setShouldUseSystem = (to: boolean) => {}
	const isColourLight = () => true
	const theme = () => ({
		colour,
		setColour,
		shouldUseSystem,
		isColourLight,
		setShouldUseSystem,
		vars: assignInlineVars({}),
		class: css.colours,
	})
	return [theme] as const
}

const context = createContext(createThemeContext())

export function useTheme() {
	return useContext(context)
}

// Component

const ProviderTheme: ParentComponent<{
	initialColour: string
	initialShouldUseSystem: string
}> = (props) => {
	const _initialShouldUseSystem = () => {
		if (props.initialShouldUseSystem === 'false') {
			return false
		}
		if (props.initialShouldUseSystem === 'true') {
			return true
		}
		return false
	}

	const [colour, setColour] = createSignal(props.initialColour)
	const [shouldUseSystem, setShouldUseSystem] = createSignal(
		_initialShouldUseSystem(),
	)

	const readable = () => readableColor(colour(), colourDark, colourLight)

	const isColourLight = () => readable() === colourLight

	function createColour(weight: number): string {
		const mixed = mix(weight, colour(), readable())
		const { red, green, blue } = parseToRgb(mixed)
		return [red, green, blue].join()
	}

	function _setColour(to: string) {
		setColour(to)
		localStorage.setItem('colour', to)
	}

	function _setShouldUseSystem(to: boolean) {
		setShouldUseSystem(to)
		localStorage.setItem('shouldUseSystem', to ? 'true' : 'false')
	}

	const theme = () => {
		return {
			colour,
			setColour: _setColour,
			shouldUseSystem,
			isColourLight,
			setShouldUseSystem: _setShouldUseSystem,
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

	return <context.Provider value={[theme]}>{props.children}</context.Provider>
}

export default ProviderTheme
