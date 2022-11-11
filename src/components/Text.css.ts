import { style, styleVariants } from '@vanilla-extract/css'

export const root = style({
	display: 'block',
	fontSize: 'inherit',
	fontWeight: 400,
	color: 'var(--color, inherit)',
	fontFamily: 'var(--font-interdisplay)',
})

export const body = style([
	root,
	{
		lineHeight: 1.5,
	},
])

export const heading = style([
	root,
	{
		fontWeight: 600,
	},
])

export const variant = styleVariants({
	bodyXs: [
		body,
		{
			fontSize: 16,
		},
	],
	bodyS: [
		body,
		{
			letterSpacing: '0.01em',
			fontSize: 18,
		},
	],
	bodyM: [
		body,
		{
			lineHeight: 1.4,
			letterSpacing: '0.01em',
			fontSize: 20,
		},
	],
	headingXs: [
		heading,
		{
			letterSpacing: '0.6em',
			lineHeight: 1,
			fontSize: 16,
		},
	],
	headingS: [
		heading,
		{
			letterSpacing: '0.6em',
			lineHeight: 1.1,
			fontSize: 17,
		},
	],
	headingM: [
		heading,
		{
			letterSpacing: '0.7em',
			lineHeight: 1.3,
			fontSize: 22,
		},
	],
})
