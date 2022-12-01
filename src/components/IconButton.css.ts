import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const icon = style({
	width: '100%',
	height: '100%',
})

export const tooltip = style({
	borderRadius: 4,
	pointerEvents: 'none',
	backgroundColor: themeCss.colourVar,
	border: `1px solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
})
