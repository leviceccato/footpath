import { style, styleVariants } from '@vanilla-extract/css'

export const root = style({
	maxHeight: '100%',
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

export const overflowShadowVariant = styleVariants({
	top: [
		overflowShadow,
		{
			top: 0,
			left: 0,
			width: '100%',
			backgroundImage: `linear-gradient(0deg, )`,
		},
	],
	bottom: [
		overflowShadow,
		{
			left: 0,
			bottom: 0,
			width: '100%',
		},
	],
	left: [
		overflowShadow,
		{
			top: 0,
			left: 0,
			height: '100%',
		},
	],
	right: [
		overflowShadow,
		{
			top: 0,
			right: 0,
			height: '100%',
		},
	],
})
