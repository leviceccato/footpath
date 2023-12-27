import * as themeCss from '@/providers/Theme.css'
import { headerHeight } from '@/routes/_Root.css'
import { style, styleVariants } from '@vanilla-extract/css'

export const root = style({
	display: 'flex',
	height: headerHeight,
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
	':hover': {
		backgroundColor: themeCss.colour50Var,
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
	':hover': {
		backgroundColor: themeCss.colour100Var,
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
	':hover': {
		backgroundColor: themeCss.colour100Var,
	},
})

export const addTabIcon = style({
	width: 16,
})

export const menuContainer = style({})
