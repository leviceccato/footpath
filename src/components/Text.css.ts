import { type Font, fontPlexSansMedium } from '@/base.css'
import { style, styleVariants } from '@vanilla-extract/css'

function createCroppedFont(font: Font, lineHeight: number) {
	return {
		fontWeight: font.weight,
		fontFamily: font.family,
		lineHeight,
		'::before': {
			content: '',
			display: 'block',
			height: 0,
			width: 0,
			marginTop: `calc((${font.top} - ${lineHeight}) * 0.5em)`,
		},
		'::after': {
			content: '',
			display: 'block',
			height: 0,
			width: 0,
			marginBottom: `calc((${font.top} - ${lineHeight}) * 0.5em)`,
		},
	}
}

export const root = style({
	display: 'block',
	fontSize: 'inherit',
	...createCroppedFont(fontPlexSansMedium, 1.4),
})

export const body = style([
	root,
	{
		...createCroppedFont(fontPlexSansMedium, 1.4),
	},
])

export const heading = style([
	root,
	{
		fontWeight: 600,
	},
])

export const variant = styleVariants({
	bodyXxs: [
		body,
		{
			fontSize: 12,
		},
	],
	bodyXs: [
		body,
		{
			fontSize: 14,
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
