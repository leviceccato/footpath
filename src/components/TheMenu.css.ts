import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	display: 'flex',
	alignItems: 'center',
	gap: 4,
	padding: '0 4px',
})

export const icon = style({
	minWidth: 18,
	height: 18,
})

export const button = style({
	height: 'calc(100% - 8px)',
	minWidth: 32,
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	selectors: {
		'&:hover, &:focus-visible': {
			backgroundColor: themeCss.colour100Var,
		},
	},
})

export const buttonText = style({
	padding: '0 10px',
})
