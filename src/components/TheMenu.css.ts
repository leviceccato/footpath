import { style, styleVariants } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	display: 'flex',
	alignItems: 'center',
	gap: 4,
	padding: '0 8px',
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

export const buttonVariant = styleVariants({
	default: [
		button,
		{
			border: `1px solid transparent`,
		},
	],
	dropdownOpen: [
		button,
		{
			border: `1px solid ${themeCss.colour200Var}`,
		},
	],
})

export const buttonText = style({
	padding: '0 10px',
})

export const dropdown = style({
	borderRadius: 4,
	padding: '8px 0 10px 0',
	backgroundColor: themeCss.colourVar,
	border: `1px solid ${themeCss.colour200Var}`,
	boxShadow: ' 0px 10px 15px -3px rgba(0,0,0,0.1)',
})

export const dropdownButton = style({
	display: 'flex',
	width: '100%',
	padding: '8px 16px 8px 0',
	selectors: {
		'&:hover, &:focus-visible': {
			backgroundColor: themeCss.colour100Var,
		},
	},
})

export const dropdownButtonText = style({
	paddingTop: 2,
})

export const dropdownButtonIcon = style({
	width: 16,
	height: 16,
	padding: '0 10px',
})

export const dropdownButtonIconVariant = styleVariants({
	shown: [
		dropdownButtonIcon,
		{
			opacity: 1,
		},
	],
	hidden: [
		dropdownButtonIcon,
		{
			opacity: 0,
		},
	],
})
