import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	position: 'fixed',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: `rgba(${themeCss.colourBase700Var}, 0.1)`,
})

export const container = style({
	maxWidth: 720,
	margin: '0 40px',
	width: '100%',
	backgroundColor: themeCss.colourVar,
	borderRadius: 8,
	border: `1px solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
})

export const header = style({
	padding: 20,
	borderBottom: `1px solid ${themeCss.colour150Var}`,
})

export const main = style({
	padding: 20,
})
