import { style } from '@vanilla-extract/css'

export const root = style({
	':focus-visible': {
		outlineOffset: -2,
		outline: '2px dashed currentColor',
	},
})
