import { style, styleVariants } from '@vanilla-extract/css'

export const content = style({})

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
