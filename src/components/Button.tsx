import { useFocus } from '@/providers/FocusTrap'
import { Text } from '@/components/Text'
import { type JSX, type ParentComponent, Show, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as css from './Button.css'

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	href?: string
	text?: string
}

export const Button: ParentComponent<ButtonProps> = (props) => {
	const [_props, buttonProps] = splitProps(props, ['text', 'href', 'children'])

	const [focusProps] = useFocus()

	const tag = () => {
		if (_props.href) {
			return 'a'
		}
		return 'button'
	}

	return (
		<Dynamic
			component={tag()}
			{...focusProps}
			{...buttonProps}
			href={_props.href}
			class={`${css.root} ${buttonProps.class ?? ''}`}
		>
			<Show when={_props.text} fallback={_props.children}>
				<Text variant="bodyXs">{_props.text}</Text>
			</Show>
		</Dynamic>
	)
}
