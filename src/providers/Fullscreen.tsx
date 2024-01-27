import {
	type ParentComponent,
	createContext,
	createSignal,
	onCleanup,
	onMount,
	useContext,
} from 'solid-js'

function createFullscreenContext() {
	const [isEnabled, setIsEnabled] = createSignal(false)
	const [element, setElement] = createSignal<Element | null>(null)

	function handleChange(): void {
		setElement(document.fullscreenElement)

		// If fullscreen was disabled for whatever reason, re-enable it
		if (document.fullscreenElement) {
			setIsEnabled(true)
		}
	}

	function handleError(): void {
		// Assume any error indicates that fullscreen is disabled
		setIsEnabled(false)
	}

	async function toggle(requestedElement: Element): Promise<Error | null> {
		if (element()) {
			try {
				await document.exitFullscreen()
				return null
			} catch (cause) {
				return new Error('Failed to exit fullscreen', { cause })
			}
		}
		try {
			await requestedElement.requestFullscreen()
			return null
		} catch (cause) {
			return new Error('Failed to enter fullscreen', { cause })
		}
	}

	onMount(() => {
		setIsEnabled(document.fullscreenEnabled)
		document.addEventListener('fullscreenchange', handleChange)
		document.addEventListener('fullscreenerror', handleError)
	})

	onCleanup(() => {
		document.removeEventListener('fullscreenchange', handleChange)
		document.removeEventListener('fullscreenerror', handleError)
	})

	return {
		isEnabled,
		element,
		toggle,
	}
}

const context = createContext(createFullscreenContext())

export function useFullscreen() {
	return useContext(context)
}

export const Fullscreen: ParentComponent = (props) => {
	return (
		<context.Provider value={createFullscreenContext()}>
			{props.children}
		</context.Provider>
	)
}
