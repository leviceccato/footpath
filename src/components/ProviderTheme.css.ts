import { style, createVar } from '@vanilla-extract/css'

// Define vars for ramp from readable colour to theme colour
// First create base RGB values for use with rgba function

export const colourBaseVar = createVar()
export const colourBase50Var = createVar()
export const colourBase100Var = createVar()
export const colourBase200Var = createVar()
export const colourBase300Var = createVar()
export const colourBase400Var = createVar()
export const colourBase500Var = createVar()
export const colourBase600Var = createVar()
export const colourBase700Var = createVar()
export const colourBase800Var = createVar()
export const colourBase900Var = createVar()
export const colourBase1000Var = createVar()

// Define opaque universal colours in class

export const colourVar = createVar()
export const colour50Var = createVar()
export const colour100Var = createVar()
export const colour200Var = createVar()
export const colour300Var = createVar()
export const colour400Var = createVar()
export const colour500Var = createVar()
export const colour600Var = createVar()
export const colour700Var = createVar()
export const colour800Var = createVar()
export const colour900Var = createVar()
export const colour1000Var = createVar()

// Create class

export const colours = style({
	vars: {
		[colourVar]: `rgb(${colourBaseVar})`,
		[colour50Var]: `rgb(${colourBase50Var})`,
		[colour100Var]: `rgb(${colourBase100Var})`,
		[colour200Var]: `rgb(${colourBase200Var})`,
		[colour300Var]: `rgb(${colourBase300Var})`,
		[colour400Var]: `rgb(${colourBase400Var})`,
		[colour500Var]: `rgb(${colourBase500Var})`,
		[colour600Var]: `rgb(${colourBase600Var})`,
		[colour700Var]: `rgb(${colourBase700Var})`,
		[colour800Var]: `rgb(${colourBase800Var})`,
		[colour900Var]: `rgb(${colourBase900Var})`,
		[colour1000Var]: `rgb(${colourBase1000Var})`,
	},
})
