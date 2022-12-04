import { createEffect } from 'solid-js'
import type { ParentComponent } from 'solid-js'

import { useFocus } from '@/components/ProviderFocus'

export const FocusTrap: ParentComponent<{
	when: boolean
}> = (props) => {
	let rootRef: HTMLDivElement | undefined
	let previousActiveElement: HTMLElement | null = null

	const [_, focus] = useFocus()

	function getFirstAndLastFocusables(): {
		first: HTMLElement
		last: HTMLElement
	} | null {
		if (!rootRef) {
			return null
		}

		const focusables = focus.getFocusables(rootRef)
		if (focusables.length < 2) {
			return null
		}

		return {
			first: focusables[0] as HTMLElement,
			last: focusables[1] as HTMLElement,
		}
	}

	function handleTab(event: KeyboardEvent): void {
		if (!rootRef || event.key !== 'Tab') return

		// Detect focusables every keypress in case there have
		// been changes

		const focusables = getFirstAndLastFocusables()
		if (!focusables) return

		// Go backwards if Shift is pressed

		if (event.shiftKey && document.activeElement === focusables.first) {
			focusables.last.focus()
			event.preventDefault()
			return
		}

		// Otherwise go forwards

		if (document.activeElement === focusables.last) {
			focusables.first.focus()
			event.preventDefault()
		}
	}

	function trap(): void {
		if (!rootRef) return

		focus.setFocusablesActive(rootRef, true)

		previousActiveElement = document.activeElement as HTMLElement

		rootRef?.addEventListener('keydown', handleTab)
	}

	function untrap(): void {
		if (!rootRef) return

		rootRef.removeEventListener('keydown', handleTab)

		previousActiveElement?.focus()
		previousActiveElement = null

		focus.setFocusablesActive(rootRef, false)
	}

	createEffect(() => {
		if (!rootRef || !getFirstAndLastFocusables()) return

		if (props.when) {
			return trap()
		}
		untrap()
	})

	return <div ref={rootRef}>{props.children}</div>
}
