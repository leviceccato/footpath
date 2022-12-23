import { style } from '@vanilla-extract/css'

export const unreachableFocusable = style({
	':focus': {
		outline: 'none',
	},
})
