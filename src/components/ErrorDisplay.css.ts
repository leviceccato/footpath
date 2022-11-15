import { style } from '@vanilla-extract/css'

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 20,
	textAlign: 'center',
	padding: 20,
	height: '100%',
})
