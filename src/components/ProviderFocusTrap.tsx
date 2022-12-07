import {
	createContext,
	useContext,
	createUniqueId,
	createEffect,
} from 'solid-js'
import type { ParentProps, Component } from 'solid-js'

type ProviderFocusTrapProps = ParentProps & {
	when: boolean
}

function createFocusTrapContext(
	props: ProviderFocusTrapProps,
	rootRef?: HTMLDivElement,
) {
	const id = createUniqueId()
	const attr = `data-focusable-${id}`

	const focusableProps = {
		[attr]: true,
		tabindex: '0',
	}

	let previousActiveElement: HTMLElement | null = null

	function getFocusables(): NodeListOf<Element> | [] {
		if (!rootRef) {
			return []
		}
		return rootRef.querySelectorAll(attr)
	}

	function setFocusablesActive(to: boolean): void {
		getFocusables().forEach((el) => {
			el.setAttribute('tabindex', to ? '0' : '-1')
		})
	}

	function getFirstAndLastFocusables(): {
		first: HTMLElement
		last: HTMLElement
	} | null {
		if (!rootRef) {
			return null
		}

		const focusables = getFocusables()
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

		// Handle cycling at start

		if (event.shiftKey && document.activeElement === focusables.first) {
			focusables.last.focus()
			event.preventDefault()
			return
		}

		// Handle cycling at end

		if (document.activeElement === focusables.last) {
			focusables.first.focus()
			event.preventDefault()
		}
	}

	function trapFocus(): void {
		if (!rootRef) return

		setFocusablesActive(true)

		previousActiveElement = document.activeElement as HTMLElement
		const focusables = getFirstAndLastFocusables()
		focusables?.first.focus()

		rootRef?.addEventListener('keydown', handleTab)
	}

	function releaseFocus(): void {
		if (!rootRef) return

		rootRef.removeEventListener('keydown', handleTab)

		previousActiveElement?.focus()
		previousActiveElement = null

		setFocusablesActive(false)
	}

	createEffect(() => {
		if (!rootRef) return

		if (props.when) {
			return trapFocus()
		}
		releaseFocus()
	})

	return [focusableProps] as const
}

const context = createContext(createFocusTrapContext({ when: false }))

export function useFocus() {
	return useContext(context)
}

const ProviderFocusTrap: Component<ProviderFocusTrapProps> = (props) => {
	let rootRef: HTMLDivElement | undefined

	return (
		<context.Provider value={createFocusTrapContext(props, rootRef)}>
			<div ref={rootRef}>{props.children}</div>
		</context.Provider>
	)
}

export default ProviderFocusTrap
