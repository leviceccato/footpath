import { icons as iconConstants } from '@/data/icons'
import { type ClassProps, defaultProps } from '@/utils/misc'
import {
	type Component,
	For,
	type ParentComponent,
	createContext,
	useContext,
} from 'solid-js'
import * as css from './Icons.css'

type Icons = typeof iconConstants

export type IconName = keyof Icons

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

const Icon: Component<ClassProps & { name: IconName }> = (rawProps) => {
	const props = defaultProps(rawProps, { class: '' })

	const icon = iconConstants[props.name]

	return (
		<svg
			class={`${css.icon} ${props.class}`}
			width={icon.viewBox[2]}
			height={icon.viewBox[3]}
		>
			<use href={`#icon_${props.name}`} />
		</svg>
	)
}

const Symbols: Component = () => {
	return (
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
	)
}

const context = createContext([Icon, Symbols] as const)

export function useIcons() {
	return useContext(context)
}

// Main component

export const Icons: ParentComponent = (props) => {
	return (
		<context.Provider value={[Icon, Symbols]}>
			{props.children}
		</context.Provider>
	)
}
