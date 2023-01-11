import { style, globalStyle as g } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'
import * as baseCss from '@/base.css'

export const root = style({
	maxHeight: '100%',
})

const editor = `${root} .cm-editor`

g(editor, {
	height: '100%',
	fontSize: 14,
})

g(`${editor} .cm-scroller`, {
	fontFamily: baseCss.fontPlexMonoRegular.family,
	// overflowX: 'visible',
})

g(`${editor}.cm-focused`, {
	outline: 'none',
})

g(`${editor} .cm-gutters`, {
	backgroundColor: 'transparent',
	color: themeCss.colour400Var,
	borderRight: `1px solid ${themeCss.colour150Var}`,
})

g(`${editor} .cm-lineNumbers .cm-gutterElement`, {
	minWidth: '4ch',
})

g(`${editor} .cm-activeLineGutter`, {
	backgroundColor: 'transparent',
})

g(`${editor} .cm-activeLine`, {
	position: 'relative',
	backgroundColor: 'transparent',
})

g(`${editor} .cm-cursor`, {
	borderLeft: `2px solid ${themeCss.colour1000Var}`,
})
