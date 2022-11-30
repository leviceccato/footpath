import { createContext, useContext, For } from 'solid-js'
import type { ParentComponent } from 'solid-js'

const context = createContext([
	{
		get: (_: string): HTMLDivElement | undefined => undefined,
	},
])

export function usePortal() {
	return useContext(context)
}

const ProviderPortal: ParentComponent<{
	mountIds: string[]
}> = (props) => {
	let mountRefs = new Map<string, HTMLDivElement>()

	const value = {
		get: (key: string) => mountRefs.get(key),
	}

	return (
		<>
			<context.Provider value={[value]}>{props.children}</context.Provider>
			<For each={props.mountIds}>
				{(id) => <div ref={(ref) => mountRefs.set(id, ref)} />}
			</For>
		</>
	)
}

export default ProviderPortal
