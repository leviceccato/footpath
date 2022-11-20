import { createVar, style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({})

export const spectrumContainer = style({
	position: 'relative',
	border: `1px solid ${themeCss.colour1000Var}`,
})

export const spectrum = style({
	display: 'block',
	aspectRatio: '1',
	width: '100%',
})

export const colourSelector = style({})

export const hueRangeContainer = style({
	padding: '6px 12px',
})

export const hueVar = createVar()

export const hueRange = style({
	height: 8,
	border: `1px solid ${themeCss.colour1000Var}`,
	borderRadius: 1000,
	background:
		'linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))',
	'::-webkit-slider-thumb': {
		boxShadow: `0 0 0 0.5px ${themeCss.colour1000Var}`,
		backgroundColor: `hsla(${hueVar} 100% 50%)`,
		height: 6,
		width: 6,
		transform: 'scale(2)',
		borderRadius: 1000,
	},
})
