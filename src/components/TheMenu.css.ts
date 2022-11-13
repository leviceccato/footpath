import { style } from '@vanilla-extract/css'

export const root = style({
	display: 'flex',
	alignItems: 'center',
	gap: 20,
	padding: '0 20px',
})

export const icon = style({
	minWidth: 18,
	height: 18,
})
