import * as themeCss from '@/providers/Theme.css'
import { style } from '@vanilla-extract/css'

export const root = style({
	position: 'fixed',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: 'rgba(0 0 0 / 0.15)',
})

export const container = style({
	maxWidth: 720,
	margin: '0 40px',
	width: '100%',
	backgroundColor: themeCss.colourVar,
	borderRadius: 8,
	border: `${themeCss.dpriUnitVar} solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
})

export const header = style({
	padding: '16px 20px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderBottom: `${themeCss.dpriUnitVar} solid ${themeCss.colour150Var}`,
})

export const main = style({
	padding: 20,
})
