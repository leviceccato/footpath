import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	backgroundColor: themeCss.colourVar,
	height: '100vh',
})

export const header = style({
	display: 'flex',
	height: 40,
	borderBottom: `1px solid ${themeCss.colour100Var}`,
})

export const logoContainer = style({
	padding: 4,
	display: 'flex',
	borderRight: `1px solid ${themeCss.colour100Var}`,
})

export const logo = style({
	width: 48,
	maxWidth: 'none',
	color: themeCss.colour900Var,
	paddingTop: '2%',
})

export const logoLink = style({
	padding: '0 10px',
	borderRadius: 4,
	display: 'flex',
	alignItems: 'center',
	':hover': {
		backgroundColor: themeCss.colour50Var,
	},
})

export const tabContainer = style({
	width: '100%',
})

export const menuContainer = style({
	padding: 4,
})
