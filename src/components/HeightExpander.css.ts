import { style, styleVariants } from '@vanilla-extract/css'

export const root = style({
	display: 'grid',
	transition: 'grid-template-rows 250ms',
	overflow: 'hidden',
})

export const inner = style({
	minHeight: 0,
})

export const variant = styleVariants({
	unexpanded: [
		root,
		{
			gridTemplateColumns: '0fr',
		},
	],
	expanded: [
		root,
		{
			gridTemplateColumns: '1fr',
		},
	],
})
