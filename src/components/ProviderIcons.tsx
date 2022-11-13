import { createContext, createSignal, useContext, For } from 'solid-js'
import type { ParentComponent, Component } from 'solid-js'
import iconConstants from '@/constants/icons'
import * as css from './ProviderIcons.css'

type Icons = typeof iconConstants

const icons = (Object.keys(iconConstants) as (keyof Icons)[]).map((name) => {
	const icon = iconConstants[name]
	return {
		...icon,
		viewBox: icon.viewBox.join(' '),
	}
})

const context = createContext([iconConstants])

export function useIcons() {
	return useContext(context)
}

// Main component

const ProviderIcons: ParentComponent = (props) => {
	return (
		<>
			<svg>
				<For each={icons}>
					{(icon) => (
						<symbol
							id={icon.id}
							viewBox={icon.viewBox}
							innerHTML={icon.content}
						/>
					)}
				</For>
			</svg>
			<context.Provider value={[iconConstants]}>
				{props.children}
			</context.Provider>
		</>
	)
}

export default ProviderIcons
