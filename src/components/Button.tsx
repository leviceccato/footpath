import { Text } from '@/components/Text'
import { useFocus } from '@/providers/FocusTrap'
import { type JSX, type ParentComponent, Show, type Signal } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as css from './Button.css'

type ButtonAttrs = JSX.ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = {
	href?: string
	text?: string
	class?: ButtonAttrs['class']
	onMouseMove?: ButtonAttrs['onMouseMove']
	onMouseLeave?: ButtonAttrs['onMouseLeave']
	onClick?: ButtonAttrs['onClick']
	refSignal?: Signal<HTMLButtonElement | undefined>
}

export const Button: ParentComponent<ButtonProps> = (props) => {
	const focus = useFocus()
	const [_, setRef] = props.refSignal ?? []

	const tag = () => {
		if (props.href) {
			return 'a'
		}
		return 'button'
	}

	return (
		<Dynamic
			component={tag()}
			{...focus.reachableFocusableProps}
			onMouseMove={props.onMouseMove}
			onMouseLeave={props.onMouseLeave}
			onClick={props.onClick}
			href={props.href}
			ref={(ref: HTMLButtonElement) => setRef?.(ref)}
			class={`${css.root} ${props.class ?? ''}`}
		>
			<Show when={props.text} fallback={props.children}>
				<Text variant="bodyXs">{props.text}</Text>
			</Show>
		</Dynamic>
	)
}
