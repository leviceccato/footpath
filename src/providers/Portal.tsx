import {
	type Component,
	Index,
	type ParentComponent,
	createContext,
	createSignal,
	onCleanup,
	onMount,
	useContext,
} from 'solid-js'
import * as css from './Portal.css'

const Mounts: Component = () => {
	const mountRefs = new Map<string, HTMLDivElement>()

	const portal = usePortal()

	onMount(() => {
		portal.setMounts(mountRefs)
	})

	onCleanup(() => {
		mountRefs.clear()
	})

	return (
		<Index each={portal.mountIds}>
			{(id) => (
				<div class={css.mount} ref={(ref) => mountRefs.set(id(), ref)} />
			)}
		</Index>
	)
}

function createPortalContext() {
	const [mounts, setMounts] = createSignal(new Map<string, HTMLDivElement>())
	const mountIds: string[] = []
	return { mounts, setMounts, Mounts, mountIds } as const
}

const context = createContext(createPortalContext())

export function usePortal() {
	return useContext(context)
}

export const Portal: ParentComponent<{
	mountIds: string[]
}> = (props) => {
	const [mounts, setMounts] = createSignal(new Map<string, HTMLDivElement>())

	return (
		<context.Provider
			value={{ mounts, setMounts, Mounts, mountIds: props.mountIds }}
		>
			{props.children}
		</context.Provider>
	)
}
