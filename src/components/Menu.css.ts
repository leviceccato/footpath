import * as themeCss from '@/providers/Theme.css'
import { style } from '@vanilla-extract/css'

export const root = style({
	borderRadius: 4,
	backgroundColor: themeCss.colourVar,
	border: `1px solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
	display: 'flex',
	flexDirection: 'column',
	gap: 4,
	padding: '8px 0 10px 0',
})
