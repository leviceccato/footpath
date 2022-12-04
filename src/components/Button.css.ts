import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	':focus-visible': {
		outlineOffset: -2,
		outline: `2px dashed ${themeCss.colour1000Var}`,
	},
})
