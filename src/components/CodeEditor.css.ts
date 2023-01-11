import { style, globalStyle as g } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'
import * as baseCss from '@/base.css'

export const root = style({
	height: '100%',
})

const editor = `${root} .cm-editor`

g(editor, {
	height: '100%',
	fontSize: 14,
})

g(`${editor} .cm-scroller`, {
	fontFamily: baseCss.fontPlexMonoRegular.family,
})

g(`${editor}.cm-focused`, {
	outline: 'none',
})

g(`${editor} .cm-content, ${editor} *`, {
	caretColor: themeCss.colour1000Var,
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
	backgroundColor: themeCss.colour50Var,
})

g(`${editor} .cm-activeLine::before`, {
	content: '',
	zIndex: 0,
	pointerEvents: 'none',
	position: 'absolute',
	inset: '-3px 0 -2px 0',
	borderTop: `3px solid ${themeCss.colour50Var}`,
	borderBottom: `2px solid ${themeCss.colour50Var}`,
})
