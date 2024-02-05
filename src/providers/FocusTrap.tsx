import {
	type Component,
	type JSX,
	createContext,
	createEffect,
	createRoot,
	createUniqueId,
	onCleanup,
	useContext,
} from 'solid-js'
import * as css from './FocusTrap.css'

type FocusableProps = {
	[x: string]: string | boolean
	tabindex: string
}

type Focus = {
	reachableFocusableProps: FocusableProps
	unreachableFocusableProps: FocusableProps
}

type FocusTrapProps = {
	children?: (_: Focus) => JSX.Element
	when: boolean
}

function createFocusTrapContext(props: FocusTrapProps) {
	return createRoot(() => {
		const id = createUniqueId()
		const focusableAttr = `data-focusable-${id}`
		const reachableFocusableAttr = `data-reachable-focusable-${id}`

		const reachableFocusableProps: FocusableProps = {
			[focusableAttr]: true,
			[reachableFocusableAttr]: true,
			tabindex: '0',
		}

		const unreachableFocusableProps: FocusableProps = {
			[focusableAttr]: true,
			class: css.unreachableFocusable,
			tabindex: '-1',
		}

		let rootRef: HTMLDivElement | undefined
		let previousActiveElement: HTMLElement | null = null

		function getFocusables(attr: string): HTMLElement[] {
			if (!rootRef) {
				return []
			}
			return Array.from(rootRef.querySelectorAll(`[${attr}]`)) as HTMLElement[]
		}

		function getReachableFocusables(): HTMLElement[] {
			return getFocusables(reachableFocusableAttr)
		}

		function setFocusablesActive(to: boolean): void {
			for (const el of getReachableFocusables()) {
				el.setAttribute('tabindex', to ? '0' : '-1')
			}
		}

		function handleTab(event: KeyboardEvent): void {
			if (!rootRef || event.key !== 'Tab') return

			/* Detect focusables every keypress in case there have
		been changes */

			const focusables = getReachableFocusables()
			if (!focusables.length) return

			const firstFocusable = focusables[0]
			const lastFocusable = focusables[focusables.length - 1]

			/* Handle cycling at start */

			if (event.shiftKey && document.activeElement === firstFocusable) {
				lastFocusable.focus()
				event.preventDefault()
				return
			}

			/* Handle cycling at end */

			if (!event.shiftKey && document.activeElement === lastFocusable) {
				firstFocusable.focus()
				event.preventDefault()
			}
		}

		function trapFocus(): void {
			if (!rootRef) return

			const [firstFocusable] = getFocusables(focusableAttr)
			if (!firstFocusable) return

			setFocusablesActive(true)

			previousActiveElement = document.activeElement as HTMLElement
			firstFocusable.focus()

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
			releaseFocus()
		})

		return {
			reachableFocusableProps,
			unreachableFocusableProps,
			getReachableFocusables,
			rootRef,
		}
	})
}

const context = createContext(createFocusTrapContext({ when: false }))

export function useFocus() {
	return useContext(context)
}

export const FocusTrap: Component<FocusTrapProps> = (props) => {
	const contextValue = createFocusTrapContext(props)
	return (
		<context.Provider value={contextValue}>
			<div ref={contextValue.rootRef}>{props.children?.(contextValue)}</div>
		</context.Provider>
	)
}
