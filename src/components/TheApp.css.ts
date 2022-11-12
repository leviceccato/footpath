import { style, createVar, styleVariants } from '@vanilla-extract/css'
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
	selectors: {
		'&:hover, &:focus-visible': {
			backgroundColor: themeCss.colour100Var,
		},
	},
})

export const scrollArea = style({
	width: '100%',
	height: '100%',
	borderLeft: `1px solid ${themeCss.colour100Var}`,
	borderRight: `1px solid ${themeCss.colour100Var}`,
})

export const tabContainer = style({
	whiteSpace: 'nowrap',
	display: 'flex',
})

export const tabButtonWrapper = style({
	position: 'relative',
	width: '100%',
	minWidth: 100,
	selectors: {
		'&:not(:first-of-type)': {
			borderLeft: `1px solid ${themeCss.colour100Var}`,
		},
	},
})

export const tabButton = style({
	height: headerHeight,
	alignItems: 'center',
	width: '100%',
	paddingLeft: 16,
	selectors: {
		'&:hover, &:focus-visible': {
			backgroundColor: themeCss.colour50Var,
		},
	},
})

export const tabButtonVariant = styleVariants({
	inactive: [
		tabButton,
		{
			color: themeCss.colour500Var,
		},
	],
})

export const closeTabButton = style({
	position: 'absolute',
	right: 6,
	top: '50%',
	width: 20,
	height: 20,
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	transform: 'translateY(-50%)',
	selectors: {
		'&:hover, &:focus-visible': {
			opacity: 1,
			backgroundColor: themeCss.colour100Var,
		},
	},
})

export const closeTabButtonVariant = styleVariants({
	inactive: [
		closeTabButton,
		{
			opacity: 0,
		},
	],
})

export const addTabButton = style({
	margin: 4,
	borderRadius: 4,
	minWidth: `calc(${headerHeight} - 8px)`,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	selectors: {
		'&:hover, &:focus-visible': {
			backgroundColor: themeCss.colour100Var,
		},
	},
})

export const menuContainer = style({
	padding: 4,
})

export const main = style({
	borderTop: `1px solid ${themeCss.colour100Var}`,
})
