import { onMount } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './CodeEditor.css'
import { EditorView, basicSetup } from 'codemirror'
import { gutter } from '@codemirror/view'
import type { EditorView as _EditorView } from 'codemirror'

const CodeEditor: Component = () => {
	let rootRef: HTMLDivElement | undefined
	let view: _EditorView | undefined

	function initView(): void {
		view = new EditorView({
			extensions: [basicSetup, gutter({ renderEmptyElements: true })],
			parent: rootRef,
		})
	}

	onMount(() => {
		initView()
	})

	return (
		<div
			class={css.root}
			ref={rootRef}
		/>
	)
}

export default CodeEditor
