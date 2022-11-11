import { createVar, style } from '@vanilla-extract/css'

export const bgColourHueVar = createVar()

export const bgColourSaturationVar = createVar()

//  Colour lightness vars

export const colourLightness0Var = createVar()
export const colourLightness1Var = createVar()
export const colourLightness2Var = createVar()
export const colourLightness3Var = createVar()
export const colourLightness4Var = createVar()
export const colourLightness5Var = createVar()
export const colourLightness6Var = createVar()
export const colourLightness7Var = createVar()
export const colourLightness8Var = createVar()
export const colourLightness9Var = createVar()
export const colourLightness10Var = createVar()

// Fully formed colour vars

export const colour0Var = createVar()
export const colour1Var = createVar()
export const colour2Var = createVar()
export const colour3Var = createVar()
export const colour4Var = createVar()
export const colour5Var = createVar()
export const colour6Var = createVar()
export const colour7Var = createVar()
export const colour8Var = createVar()
export const colour9Var = createVar()
export const colour10Var = createVar()

// Generate class containing all fully formed colours

function createColour(colourVar: ReturnType<typeof createVar>): string {
	return `hsl(${bgColourHueVar}, ${bgColourSaturationVar}, ${colourVar})`
}

export const colours = style({
	vars: {
		[colour0Var]: createColour(colourLightness0Var),
		[colour1Var]: createColour(colourLightness1Var),
		[colour2Var]: createColour(colourLightness2Var),
		[colour3Var]: createColour(colourLightness4Var),
		[colour5Var]: createColour(colourLightness5Var),
		[colour6Var]: createColour(colourLightness6Var),
		[colour7Var]: createColour(colourLightness7Var),
		[colour8Var]: createColour(colourLightness8Var),
		[colour9Var]: createColour(colourLightness9Var),
		[colour10Var]: createColour(colourLightness10Var),
	},
})
