import { style, createVar, styleVariants } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const headerHeight = createVar()
export const viewBarHeight = createVar()

export const root = style({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: themeCss.colourVar,
	color: themeCss.colour1000Var,
	vars: {
		[headerHeight]: '40px',
		[viewBarHeight]: '40px',
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
	width: 66,
	height: 17.26,
	maxWidth: 'none',
	color: themeCss.colour900Var,
})

export const logoLink = style({
	padding: '0 8px',
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

export const main = style({
	borderTop: `1px solid ${themeCss.colour150Var}`,
	height: '100%',
	display: 'flex',
})

export const viewContainer = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
})

export const viewResizer = style({
	width: 1,
	position: 'relative',
	backgroundColor: themeCss.colour150Var,
	'::before': {
		content: '',
		position: 'absolute',
		inset: '0 -2px',
		cursor: 'col-resize',
	},
	'::after': {
		content: '',
		position: 'absolute',
		inset: '0 -2px',
		cursor: 'col-resize',
		opacity: 0,
		backgroundColor: themeCss.colour300Var,
	},
	selectors: {
		'&:active::before': {
			position: 'fixed',
			inset: 0,
		},
		'&:hover::after': {
			opacity: 1,
			transitionDelay: '300ms',
		},
	},
})

export const viewBar = style({
	height: viewBarHeight,
	display: 'flex',
	borderBottom: `1px solid ${themeCss.colour150Var}`,
})

export const view = style({
	height: '100%',
})

const checkerSize = 60
const halfCheckerSize = checkerSize / 2

export const viewSvg = style({
	backgroundImage: `linear-gradient(45deg, ${themeCss.colour50Var} 25%, transparent 25%), linear-gradient(-45deg, ${themeCss.colour50Var} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${themeCss.colour50Var} 75%), linear-gradient(-45deg, transparent 75%, ${themeCss.colour50Var} 75%)`,
	backgroundSize: `${checkerSize}px ${checkerSize}px`,
	backgroundPosition: `0 0, 0 ${halfCheckerSize}px, ${halfCheckerSize}px -${halfCheckerSize}px, -${halfCheckerSize}px 0px`,
	height: '100%',
})

export const viewSvgInner = style({
	height: '100%',
})
