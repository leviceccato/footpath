import { style } from '@vanilla-extract/css'

export const root = style({
	display: 'inline-flex',
	color: 'inherit',
	background: 'none',
	border: 'none',
	fontFamily: 'inherit',
	textAlign: 'inherit',
	fontSize: 'inherit',
	letterSpacing: 'inherit',
	lineHeight: 'inherit',
	padding: 0,
	WebkitTapHighlightColor: ['rgba(0, 0, 0, 0)', 'transparent'],
	':focus': {
		outline: 'none',
	},
	':focus-visible': {
		boxShadow: '0px 0px 0px 2px currentColor',
	},
})
