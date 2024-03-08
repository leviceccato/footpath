import { type ClassProps, defaultProps } from '@/utils/solid'
import type { EditorView } from 'codemirror'
import { type Component, onCleanup, onMount } from 'solid-js'
import * as css from './CodeEditor.css'
const importCm = () => import('codemirror')
const importCmCommands = () => import('@codemirror/commands')
const importCmView = () => import('@codemirror/view')

export const CodeEditor: Component<ClassProps> = (rawProps) => {
	const props = defaultProps(rawProps, { class: '' })

	let rootRef: HTMLDivElement | undefined
	let editor: EditorView | undefined

	async function initEditor(): Promise<void> {
		const [cm, commands, view] = await Promise.all([
			importCm(),
			importCmCommands(),
			importCmView(),
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

	return <div class={`${css.root} ${props.class}`} ref={rootRef} />
}
