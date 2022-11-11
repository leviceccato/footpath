import { style, createVar } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const headerHeight = createVar()

export const root = style({
	backgroundColor: themeCss.colourVar,
	height: '100vh',
	vars: {
		[headerHeight]: '40px',
	},
})

export const header = style({
	display: 'flex',
	height: headerHeight,
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
		backgroundColor: themeCss.colour100Var,
	},
})

export const scrollArea = style({
	width: '100%',
	height: '100%',
})

export const tabContainer = style({
	whiteSpace: 'nowrap',
	display: 'flex',
})

export const tabButton = style({
	height: headerHeight,
})

export const addTabButton = style({
	margin: 4,
	borderRadius: 4,
	width: `calc(${headerHeight} - 8px)`,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	':hover': {
		backgroundColor: themeCss.colour100Var,
	},
})

export const menuContainer = style({
	padding: 4,
	borderLeft: `1px solid ${themeCss.colour100Var}`,
})

export const main = style({
	borderTop: `1px solid ${themeCss.colour100Var}`,
})
