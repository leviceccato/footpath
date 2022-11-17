import { createContext, createSignal, useContext, For } from 'solid-js'
import type { ParentComponent, Component } from 'solid-js'
import iconConstants from '@/data/icons'
import * as css from './ProviderIcons.css'

type Icons = typeof iconConstants

type IconName = keyof Icons

const iconNames = Object.keys(iconConstants) as IconName[]

const icons = iconNames.map((name) => {
	const icon = iconConstants[name]
	return {
		...icon,
		id: `icon_${name}`,
		viewBox: icon.viewBox.join(' '),
	}
})

// Consumer component exposed with context

const Icon: Component<{ class?: string; name: IconName }> = (props) => {
	const icon = iconConstants[props.name]
	return (
		<svg
			class={`${css.icon} ${props.class ?? ''}`}
			width={icon.viewBox[2]}
			height={icon.viewBox[3]}
		>
			<use href={`#icon_${props.name}`} />
		</svg>
	)
}

const context = createContext([Icon])

export function useIcons() {
	return useContext(context)
}

// Main component

const ProviderIcons: ParentComponent = (props) => {
	return (
		<>
			<svg class={css.root}>
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
			<context.Provider value={[Icon]}>{props.children}</context.Provider>
		</>
	)
}

export default ProviderIcons
