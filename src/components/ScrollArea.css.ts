import * as themeCss from '@/providers/Theme.css'
import { globalStyle, style } from '@vanilla-extract/css'

export const root = style({
	maxHeight: '100%',
})

export const scrollable = style({
	':focus': {
		outline: 'none',
	},
	':focus-visible': {
		outlineOffset: -2,
		outline: '2px dashed currentColor',
	},
})

export const overlay = style({
	position: 'absolute',
	inset: 0,
	overflow: 'hidden',
	pointerEvents: 'none',
})

export const overflowShadow = style({
	position: 'absolute',
	opacity: 0,
	transition: 'opacity 250ms',
})

function createOverflowGradient(degress: number): string {
	return `linear-gradient(${degress}deg, transparent 0%, rgba(${themeCss.colourBase700Var}, 0.1) 100%)`
}

export const overflowShadowTop = style([
	overflowShadow,
	{
		top: 0,
		left: 0,
		height: 16,
		width: '100%',
		transform: 'translate(0, -8px)',
		backgroundImage: createOverflowGradient(0),
	},
])

export const overflowShadowBottom = style([
	overflowShadow,
	{
		left: 0,
		bottom: 0,
		height: 16,
		width: '100%',
		transform: 'translate(0, 8px)',
		backgroundImage: createOverflowGradient(180),
	},
])

export const overflowShadowLeft = style([
	overflowShadow,
	{
		top: 0,
		left: 0,
		height: '100%',
		width: 16,
		transform: 'translate(-8px, 0)',
		backgroundImage: createOverflowGradient(270),
	},
])

export const overflowShadowRight = style([
	overflowShadow,
	{
		top: 0,
		right: 0,
		height: '100%',
		width: 16,
		transform: 'translate(8px, 0)',
		backgroundImage: createOverflowGradient(90),
	},
])

export const shown = style({
	opacity: 1,
	transform: 'translate(0, 0)',
})

export const scrollbar = style({
	'::before': {
		border: `${themeCss.dpriUnitVar} solid ${themeCss.colour400Var}`,
		backgroundColor: themeCss.colourVar,
		boxShadow: `0 1px 5px 0 rgba(${themeCss.colourBase700Var}, 0.1)`,
		pointerEvents: 'all',
	},
})

globalStyle(`${scrollbar}.simplebar-visible::before`, {
	opacity: 1,
})
