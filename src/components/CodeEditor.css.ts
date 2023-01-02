import { style, globalStyle as g } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export const root = style({
	height: '100%',
})

const editor = `${root} .cm-editor`

g(editor, {
	height: '100%',
})

g(`${editor}.cm-focused`, {
	outline: 'none',
})

g(`${editor} .cm-gutters`, {
	backgroundColor: 'transparent',
	color: themeCss.colour1000Var,
	borderRight: `1px solid ${themeCss.colour150Var}`,
})

g(`${editor} .cm-activeLineGutter`, {
	backgroundColor: 'transparent',
})