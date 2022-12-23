import { style } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

const checkerSize = 60
const halfCheckerSize = checkerSize / 2

export const root = style({
	backgroundImage: `linear-gradient(45deg, ${themeCss.colour50Var} 25%, transparent 25%), linear-gradient(-45deg, ${themeCss.colour50Var} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${themeCss.colour50Var} 75%), linear-gradient(-45deg, transparent 75%, ${themeCss.colour50Var} 75%)`,
	backgroundSize: `${checkerSize}px ${checkerSize}px`,
	backgroundPosition: `0 0, 0 ${halfCheckerSize}px, ${halfCheckerSize}px -${halfCheckerSize}px, -${halfCheckerSize}px 0px`,
	height: '100%',
})
