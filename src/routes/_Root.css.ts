import * as themeCss from '@/providers/Theme.css'
import { createVar, style, styleVariants } from '@vanilla-extract/css'

export const headerHeight = createVar()
export const viewBarHeight = createVar()

export const root = style({
	height: '100%',
	display: 'flex',
	overflow: 'hidden',
	flexDirection: 'column',
	backgroundColor: themeCss.colourVar,
	color: themeCss.colour1000Var,
	vars: {
		[headerHeight]: '40px',
		[viewBarHeight]: '40px',
	},
})

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
	userSelect: 'none',
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
	minHeight: viewBarHeight,
	display: 'flex',
})

export const viewBarInner = style({
	height: viewBarHeight,
	display: 'flex',
	padding: '4px 6px',
})

export const viewBarButton = style({
	minWidth: 32,
	display: 'flex',
	padding: '0 8px',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	':hover': {
		backgroundColor: themeCss.colour100Var,
		color: themeCss.colour1000Var,
	},
})

export const viewBarButtonVariant = styleVariants({
	inactive: [
		viewBarButton,
		{
			color: themeCss.colour400Var,
		},
	],
	active: [
		viewBarButton,
		{
			color: themeCss.colour1000Var,
		},
	],
})

export const view = style({
	height: '100%',
	borderTop: `1px solid ${themeCss.colour150Var}`,
})

export const codeEditor = style({
	// 2px must be removed to avoid layout shift when focus styles are shown
	height: `calc(100vh - ${headerHeight} - ${viewBarHeight} - 2px)`,
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
	pointerEvents: 'none',
	userSelect: 'none',
})
