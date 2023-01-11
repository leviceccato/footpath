import { onMount, onCleanup } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './CodeEditor.css'
import { EditorView, basicSetup } from 'codemirror'
import { gutter } from '@codemirror/view'

const CodeEditor: Component<{ class?: string }> = (props) => {
	let rootRef: HTMLDivElement | undefined
	let view: EditorView | undefined

	function initView(): void {
		view = new EditorView({
			extensions: [basicSetup, gutter({ renderEmptyElements: true })],
			parent: rootRef,
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
