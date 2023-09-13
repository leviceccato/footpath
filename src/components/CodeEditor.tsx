import { onMount, onCleanup, type Component } from 'solid-js'
import * as css from './CodeEditor.css'
import { type EditorView } from 'codemirror'
import { type ClassProps, defaultProps } from '@/utils/misc'

const CodeEditor: Component<ClassProps> = (rawProps) => {
	const props = defaultProps(rawProps, { class: '' })

	let rootRef: HTMLDivElement | undefined
	let editor: EditorView | undefined

	async function initEditor(): Promise<void> {
		const [cm, commands, view] = await Promise.all([
			import('codemirror'),
			import('@codemirror/commands'),
			import('@codemirror/view'),
		])

		editor = new cm.EditorView({
			parent: rootRef,
			extensions: [
				cm.basicSetup,
				view.keymap.of([commands.indentWithTab]),
				view.gutter({ renderEmptyElements: true }),
			],
		})
	}

	onMount(() => {
		initEditor()
	})

	onCleanup(() => {
		editor?.destroy()
	})

	return (
		<div
			class={`${css.root} ${props.class}`}
			ref={rootRef}
		/>
	)
}

export default CodeEditor
