import {
	createContext,
	createEffect,
	createSignal,
	useContext,
	onMount,
	onCleanup,
} from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { readableColor, mix, parseToRgb, hslToColorString } from 'polished'
import { colourDark, colourLight } from '@/data/colours'
import type { HslaColor, HslColor } from 'polished/lib/types/color'
import type { ParentComponent } from 'solid-js'
import * as css from './ProviderTheme.css'

function createThemeContext() {
	const [colour, _] = createSignal(colourLight)
	const [shouldUseSystem, __] = createSignal(false)
	const setColour = (_: HslColor | HslaColor) => {}
	const setShouldUseSystem = (_: boolean) => {}
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
	initialColour: HslColor | HslaColor
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

	const prefersColourSchemeDarkMedia = window.matchMedia(
		'(prefers-color-scheme: dark)',
	)

	const [colour, setColour] = createSignal(props.initialColour)
	const [prefersColourSchemeDark, setPrefersColourSchemeDark] = createSignal(
		prefersColourSchemeDarkMedia.matches,
	)
	const [shouldUseSystem, setShouldUseSystem] = createSignal(
		_initialShouldUseSystem(),
	)

	const _colour = () => {
		if (!shouldUseSystem()) {
			return colour()
		}
		if (prefersColourSchemeDark()) {
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

	function _setPrefersColourSchemeDark(event: MediaQueryListEvent) {
		setPrefersColourSchemeDark(event.matches)
	}

	function _setColour(colour: HslColor | HslaColor) {
		setShouldUseSystem(false)
		setColour(colour)
	}

	createEffect(() => {
		localStorage.setItem('colour', hslToColorString(colour()))
	})

	createEffect(() => {
		localStorage.setItem(
			'shouldUseSystem',
			shouldUseSystem() ? 'true' : 'false',
		)
	})

	onMount(() => {
		prefersColourSchemeDarkMedia.addEventListener(
			'change',
			_setPrefersColourSchemeDark,
		)
	})

	onCleanup(() => {
		prefersColourSchemeDarkMedia.removeEventListener(
			'change',
			_setPrefersColourSchemeDark,
		)
	})

	const theme = () => {
		return {
			colour: _colour,
			setColour: _setColour,
			shouldUseSystem,
			isColourLight,
			setShouldUseSystem,
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
