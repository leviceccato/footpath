import * as themeCss from '@/providers/Theme.css'
import { style, styleVariants } from '@vanilla-extract/css'

export const root = style({
	borderRadius: 4,
	backgroundColor: themeCss.colourVar,
	border: `${themeCss.dpriUnitVar} solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
	display: 'flex',
	flexDirection: 'column',
	padding: '8px 0 10px 0',
})

export const divider = style({
	width: '100%',
	margin: '4px 0',
	height: themeCss.dpriUnitVar,
	backgroundColor: themeCss.colour200Var,
})

export const button = style({
	display: 'flex',
	width: '100%',
	padding: '6px 0',
	':hover': {
		backgroundColor: themeCss.colour100Var,
	},
})

export const buttonText = style({
	paddingTop: 2,
})

const buttonIcon = style({
	width: 16,
	height: 16,
	padding: '0 10px',
})

export const buttonIconVariant = styleVariants({
	default: [buttonIcon],
	right: [
		buttonIcon,
		{
			marginLeft: 'auto',
		},
	],
})
