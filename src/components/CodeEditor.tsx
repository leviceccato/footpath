import { onMount, onCleanup } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './CodeEditor.css'
import { EditorView, basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'
import { gutter, keymap } from '@codemirror/view'
import type { ClassProps } from '@/utils/misc'

const CodeEditor: Component<ClassProps> = (props) => {
	let rootRef: HTMLDivElement | undefined
	let view: EditorView | undefined

	function initView(): void {
		view = new EditorView({
			parent: rootRef,
			extensions: [
				basicSetup,
				keymap.of([indentWithTab]),
				gutter({ renderEmptyElements: true }),
			],
		})
	}

	onMount(() => {
		initView()
	})

	onCleanup(() => {
		view?.destroy()
	})

	return (
		<div
			class={`${css.root} ${props.class ?? ''}`}
			ref={rootRef}
		/>
	)
}

export default CodeEditor
