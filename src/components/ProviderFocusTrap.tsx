import {
	createContext,
	useContext,
	createUniqueId,
	createEffect,
	onCleanup,
} from 'solid-js'
import type { ParentProps, Component } from 'solid-js'

type ProviderFocusTrapProps = ParentProps & {
	when: boolean
}

type FocusableProps = {
	[x: string]: string | boolean
	tabindex: string
}

const context = createContext<[FocusableProps]>([{ tabindex: '0' }])

export function useFocus() {
	return useContext(context)
}

const ProviderFocusTrap: Component<ProviderFocusTrapProps> = (props) => {
	const id = createUniqueId()
	const attr = `data-focusable-${id}`

	const focusableProps: FocusableProps = {
		[attr]: true,
		tabindex: '0',
	}

	let rootRef: HTMLDivElement | undefined
	let previousActiveElement: HTMLElement | null = null

	function getFocusables(): NodeListOf<Element> | [] {
		if (!rootRef) {
			return []
		}
		return rootRef.querySelectorAll(`[${attr}]`)
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
			last: focusables[focusables.length - 1] as HTMLElement,
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

		if (!event.shiftKey && document.activeElement === focusables.last) {
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

	createEffect((prev) => {
		if (!rootRef) {
			return false
		}
		if (props.when) {
			trapFocus()
		} else if (prev) {
			releaseFocus()
		}
		return props.when
	}, false)

	onCleanup(() => {
		rootRef?.removeEventListener('keydown', handleTab)
	})

	return (
		<context.Provider value={[focusableProps]}>
			<div ref={rootRef}>{props.children}</div>
		</context.Provider>
	)
}

export default ProviderFocusTrap
