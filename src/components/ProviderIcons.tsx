import { createContext, createSignal, useContext, For } from 'solid-js'
import type { ParentComponent, Component } from 'solid-js'
import iconConstants from '@/constants/icons'
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

function getIcon(name: IconName): string {
	return `<use href="#icon_${name}" />`
}

const context = createContext([getIcon])

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
			<context.Provider value={[getIcon]}>{props.children}</context.Provider>
		</>
	)
}

export default ProviderIcons
