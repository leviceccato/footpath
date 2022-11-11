import { createContext, createSignal, useContext } from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { readableColor, mix } from 'polished'
import type { Styles } from 'polished/lib/types/style'
import type { ParentComponent } from 'solid-js'
import * as css from './ProviderTheme.css'

function createThemeContext() {
	const [_, setColour] = createSignal('')
	const vars = () => assignInlineVars({})
	return [vars, setColour]
}

const context = createContext(createThemeContext())

export function useTheme() {
	return useContext(context)
}

// Component

const ProviderTheme: ParentComponent<{ initialColour: string }> = (props) => {
	const [colour, setColour] = createSignal(props.initialColour)

	const readable = () => readableColor(colour())

	const vars = () =>
		assignInlineVars({
			[css.colourVar]: colour(),
			[css.colour50Var]: mix(0.95, colour(), readable()),
			[css.colour100Var]: mix(0.9, colour(), readable()),
			[css.colour200Var]: mix(0.8, colour(), readable()),
			[css.colour300Var]: mix(0.7, colour(), readable()),
			[css.colour400Var]: mix(0.6, colour(), readable()),
			[css.colour500Var]: mix(0.5, colour(), readable()),
			[css.colour600Var]: mix(0.4, colour(), readable()),
			[css.colour700Var]: mix(0.3, colour(), readable()),
			[css.colour800Var]: mix(0.2, colour(), readable()),
			[css.colour900Var]: mix(0.1, colour(), readable()),
			[css.colour1000Var]: readable(),
		})

	return (
		<context.Provider value={[vars, setColour]}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderTheme
