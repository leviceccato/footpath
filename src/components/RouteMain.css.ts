import { style, createVar, styleVariants } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const headerHeight = createVar()

export const root = style({
	height: '100%',
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
	width: 26,
	height: 26,
	maxWidth: 'none',
	color: themeCss.colour900Var,
})

export const logoLink = style({
	padding: '0 8px',
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
	borderLeft: `1px solid ${themeCss.colour150Var}`,
	borderRight: `1px solid ${themeCss.colour150Var}`,
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
			borderLeft: `1px solid ${themeCss.colour150Var}`,
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
	active: [
		tabButton,
		{
			color: themeCss.colour1000Var,
		},
	],
	inactive: [
		tabButton,
		{
			color: themeCss.colour300Var,
		},
	],
})

export const closeTab = style({
	position: 'absolute',
	right: 6,
	top: '50%',
	padding: 2,
	width: 20,
	height: 20,
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	transform: 'translateY(-50%)',
	selectors: {
		'&:hover, &:focus-visible': {
			backgroundColor: themeCss.colour100Var,
		},
	},
})

export const closeTabVariant = styleVariants({
	active: [
		closeTab,
		{
			opacity: 1,
		},
	],
	inactive: [
		closeTab,
		{
			opacity: 0,
			selectors: {
				[`${tabButton}:hover + &, ${tabButton}:focus-visible + &, &:hover, &:focus-visible`]:
					{
						opacity: 1,
					},
			},
		},
	],
})

export const closeTabButton = style({
	padding: 2,
})

export const closeTabIcon = style({
	width: 16,
})

export const addTabButton = style({
	margin: 4,
	borderRadius: 4,
	padding: 6,
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

export const addTabIcon = style({
	width: 16,
})

export const menuContainer = style({})

export const main = style({
	borderTop: `1px solid ${themeCss.colour150Var}`,
})
