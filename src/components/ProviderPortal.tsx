import {
	createContext,
	createSignal,
	useContext,
	Index,
	onMount,
} from 'solid-js'
import * as css from './ProviderPortal.css'
import type { ParentComponent } from 'solid-js'

function createPortalContext() {
	const [mounts, setMounts] = createSignal(new Map<string, HTMLDivElement>())
	return [mounts, setMounts] as const
}

const context = createContext(createPortalContext())

export function usePortal() {
	return useContext(context)
}

const ProviderPortal: ParentComponent<{
	mountIds: string[]
}> = (props) => {
	let mountRefs = new Map<string, HTMLDivElement>()

	const [mounts, setMounts] = createPortalContext()

	onMount(() => {
		setMounts(mountRefs)
	})

	return (
		<>
			<context.Provider value={[mounts, setMounts]}>
				{props.children}
			</context.Provider>
			<Index each={props.mountIds}>
				{(id) => (
					<div
						class={css.mount}
						ref={(ref) => mountRefs.set(id(), ref)}
					/>
				)}
			</Index>
		</>
	)
}

export default ProviderPortal
