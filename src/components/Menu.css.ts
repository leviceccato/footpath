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

export const button = style({
	display: 'flex',
	width: '100%',
	padding: '8px 16px 8px 0',
	':hover': {
		backgroundColor: themeCss.colour100Var,
	},
})

export const buttonText = style({
	paddingTop: 2,
})

export const buttonIcon = style({
	width: 16,
	height: 16,
	padding: '0 10px',
})
