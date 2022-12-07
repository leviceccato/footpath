import { Dynamic } from 'solid-js/web'
import { Show, splitProps } from 'solid-js'
import type { ParentComponent, JSX } from 'solid-js'
import * as css from './Button.css'

import { useFocus } from '@/components/ProviderFocusTrap'
import Text from '@/components/Text'

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	href?: string
	text?: string
}

const Button: ParentComponent<ButtonProps> = (props) => {
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
			class={`${css.root} ${buttonProps.class ?? ''}`}
		>
			<Show
				when={_props.text}
				fallback={_props.children}
			>
				<Text variant="bodyXs">{_props.text}</Text>
			</Show>
		</Dynamic>
	)
}

export default Button
