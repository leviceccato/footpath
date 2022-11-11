import SimpleBar from 'simplebar'
import { onMount, createSignal } from 'solid-js'
import type { ParentComponent } from 'solid-js'

const ScrollArea: ParentComponent = () => {
	let rootRef: HTMLDivElement | undefined

	const [simpleBar, setSimpleBar] = createSignal<SimpleBar>()

	onMount(() => {
		if (!rootRef) return

		setSimpleBar(new SimpleBar(rootRef, {}))
	})

	return <div ref={rootRef}></div>
}

export default ScrollArea
