import * as themeCss from '@/providers/Theme.css'
import { style, styleVariants } from '@vanilla-extract/css'

export const content = style({
	position: 'absolute',
	top: 0,
	left: 0,
})

export const contentVariants = styleVariants({
	shown: [
		content,
		{
			display: 'block',
		},
	],
	hidden: [
		content,
		{
			display: 'none',
		},
	],
})

export const arrow = style({
	position: 'absolute',
	top: -3.5,
})

export const arrowInner = style({
	width: 7,
	height: 7,
	backgroundColor: themeCss.colourVar,
	borderTop: `${themeCss.dpriUnitVar} solid ${themeCss.colour200Var}`,
	borderRight: `${themeCss.dpriUnitVar} solid ${themeCss.colour200Var}`,
	transform: 'rotate(-45deg)',
})
