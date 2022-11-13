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

export const buttonWrapper = style({
	height: 'calc(100% - 8px)',
})

export const button = style({
	minWidth: 32,
	height: '100%',
	display: 'flex',
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

export const dropdown = style({
	borderRadius: 8,
	padding: 10,
	backgroundColor: themeCss.colourVar,
	border: `1px solid ${themeCss.colour200Var}`,
})
