import { style, styleVariants } from '@vanilla-extract/css'

export const root = style({})

export const rootVariant = styleVariants({
	overflowTop: [root, {}],
	overflowBottom: [root, {}],
	overflowLeft: [root, {}],
	overflowRight: [root, {}],
})
