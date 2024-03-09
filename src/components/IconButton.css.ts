import * as themeCss from '@/providers/Theme.css'
import { style } from '@vanilla-extract/css'

export const button = style({
	margin: 4,
	borderRadius: 4,
	padding: 6,
	minWidth: 32,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	':hover': {
		backgroundColor: themeCss.colour100Var,
	},
})

export const icon = style({
	width: '100%',
	height: '100%',
})

export const tooltip = style({
	pointerEvents: 'none',
})

export const tooltipInner = style({
	borderRadius: 4,
	padding: 4,
	backgroundColor: themeCss.colourVar,
	border: `${themeCss.dpriUnitVar} solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
})
