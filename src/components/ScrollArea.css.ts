import { style, styleVariants } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

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

function createOverflowGradient(degress: number): string {
	return `linear-gradient(${degress}deg, transparent 0%, ${themeCss.colour700Var}) 100%)`
}

export const overflowShadowVariant = styleVariants({
	shown: [
		overflowShadow,
		{
			opacity: 1,
		},
	],
	top: [
		overflowShadow,
		{
			top: 0,
			left: 0,
			width: '100%',
			backgroundImage: createOverflowGradient(0),
		},
	],
	bottom: [
		overflowShadow,
		{
			left: 0,
			bottom: 0,
			width: '100%',
			backgroundImage: createOverflowGradient(180),
		},
	],
	left: [
		overflowShadow,
		{
			top: 0,
			left: 0,
			height: '100%',
			backgroundImage: createOverflowGradient(270),
		},
	],
	right: [
		overflowShadow,
		{
			top: 0,
			right: 0,
			height: '100%',
			backgroundImage: createOverflowGradient(90),
		},
	],
})
