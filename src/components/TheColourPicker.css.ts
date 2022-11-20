import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({})

export const canvasContainer = style({
	position: 'relative',
	border: `1px solid ${themeCss.colour1000Var}`,
})

export const canvas = style({
	display: 'block',
	aspectRatio: '1',
	width: '100%',
})

export const colourSelector = style({})

export const hueRangeContainer = style({})

export const hueRange = style({})
