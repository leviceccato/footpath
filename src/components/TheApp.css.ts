import { style } from '@vanilla-extract/css'

export const root = style({})

export const header = style({
	display: 'flex',
	height: 40,
	borderBottom: '1px solid currentColor',
})

export const logoContainer = style({
	padding: 4,
	display: 'flex',
	borderRight: '1px solid currentColor',
})

export const logo = style({
	width: 48,
	maxWidth: 'none',
	paddingTop: '2%',
})

export const logoLink = style({
	padding: '0 10px',
	display: 'flex',
	alignItems: 'center',
})

export const tabContainer = style({
	width: '100%',
})

export const menuContainer = style({
	padding: 4,
})
