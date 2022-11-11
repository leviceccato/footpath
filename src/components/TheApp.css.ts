import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	backgroundColor: themeCss.colour10Var,
	height: '100vh',
})

export const header = style({
	display: 'flex',
	height: 40,
	borderBottom: `1px solid ${themeCss.colour9Var}`,
})

export const logoContainer = style({
	padding: 4,
	display: 'flex',
	borderRight: `1px solid ${themeCss.colour9Var}`,
})

export const logo = style({
	width: 48,
	maxWidth: 'none',
	color: themeCss.colour2Var,
	paddingTop: '2%',
})

export const logoLink = style({
	padding: '0 10px',
	borderRadius: 4,
	display: 'flex',
	alignItems: 'center',
	':hover': {
		backgroundColor: themeCss.colour9Var,
	},
})

export const tabContainer = style({
	width: '100%',
})

export const menuContainer = style({
	padding: 4,
})
