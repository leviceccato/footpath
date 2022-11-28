import { style, createVar, styleVariants } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	backgroundColor: themeCss.colourVar,
	color: themeCss.colour1000Var,
	height: '100vh',
})
