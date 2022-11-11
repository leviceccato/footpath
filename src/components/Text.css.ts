import { style } from '@vanilla-extract/css'

export const root = style({
	display: 'block',
	fontSize: 'inherit',
	fontWeight: 400,
	color: 'var(--color, inherit)',
	fontFamily: 'var(--font-interdisplay)',
})
