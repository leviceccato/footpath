import { Dynamic } from 'solid-js/web'
import { Show } from 'solid-js'
import type { ParentComponent, JSX } from 'solid-js'
import * as css from './Button.css'

import Text from '@/components/Text'

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	class?: string
	href?: string
	text?: string
}

const Button: ParentComponent<ButtonProps> = (props) => {
	const tag = () => {
		if (props.href) {
			return 'a'
		}
		return 'button'
	}

	return (
		<Dynamic
			component={tag()}
			class={`${css.root} ${props.class ?? ''}`}
			href={props.href}
			onClick={props.onClick}
		>
			<Show
				when={props.text}
				fallback={props.children}
			>
				<Text variant="bodyXs">{props.text}</Text>
			</Show>
		</Dynamic>
	)
}

export default Button
