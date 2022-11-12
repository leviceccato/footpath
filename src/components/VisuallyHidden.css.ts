import { style } from '@vanilla-extract/css'

export const focusable = style({})

export const root = style({
	selectors: {
		[`&:not(${focusable}), &${focusable}:not(:focus)`]: {
			border: 0,
			clip: 'rect(0 0 0 0)',
			height: 1,
			margin: -1,
			overflow: 'hidden',
			padding: 0,
			position: 'absolute',
			width: 1,
		},
	},
})
