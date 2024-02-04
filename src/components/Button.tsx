import { Text } from '@/components/Text'
import { useFocus } from '@/providers/FocusTrap'
import { type JSX, type ParentComponent, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as css from './Button.css'

export type ButtonProps = {
	href?: string
	text?: string
	nativeButton?: JSX.ButtonHTMLAttributes<HTMLButtonElement>
}

export const Button: ParentComponent<ButtonProps> = (props) => {
	const [focusProps] = useFocus()

	const tag = () => {
		if (props.href) {
			return 'a'
		}
		return 'button'
	}

	return (
		<Dynamic
			component={tag()}
			{...focusProps}
			{...props}
			href={props.href}
			class={`${css.root} ${props.nativeButton?.class ?? ''}`}
		>
			<Show when={props.text} fallback={props.children}>
				<Text variant="bodyXs">{props.text}</Text>
			</Show>
		</Dynamic>
	)
}
