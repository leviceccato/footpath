import * as themeCss from '@/providers/Theme.css'
import { createVar, style } from '@vanilla-extract/css'

export const hueVar = createVar()

export const root = style({})

export const spectrumContainer = style({
	position: 'relative',
	border: `${themeCss.dpriUnitVar} solid ${themeCss.colour1000Var}`,
	':focus-visible': {
		outlineOffset: 2,
		outline: `2px dashed ${themeCss.colour1000Var}`,
	},
})

export const spectrum = style({
	display: 'block',
	aspectRatio: '1',
	width: '100%',
})

export const colourSelector = style({
	width: 11,
	height: 11,
	borderRadius: 1000,
	position: 'absolute',
	top: -5,
	left: -5,
	pointerEvents: 'none',
	backgroundColor: themeCss.colourVar,
	boxShadow: `0 0 0 1px ${themeCss.colour1000Var}`,
})

export const hueRangeContainer = style({
	padding: 12,
})

export const hueRange = style({
	height: 8,
	border: `${themeCss.dpriUnitVar} solid ${themeCss.colour1000Var}`,
	borderRadius: 1000,
	background:
		'linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))',
	':focus-visible': {
		outlineOffset: 2,
		outline: `2px dashed ${themeCss.colour1000Var}`,
	},
	'::-webkit-slider-thumb': {
		boxShadow: `0 0 0 0.5px ${themeCss.colour1000Var}`,
		backgroundColor: `hsla(${hueVar} 100% 50%)`,
		height: 6,
		width: 6,
		transform: 'scale(2)',
		borderRadius: 1000,
	},
})
