import { Text } from '@/components/Text'
import { useFocus } from '@/providers/FocusTrap'
import { type JSX, type ParentComponent, Show } from 'solid-js'
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
	ref?: ButtonAttrs['ref']
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
			onMouseMove={props.onMouseMove}
			onMouseLeave={props.onMouseLeave}
			href={props.href}
			ref={props.ref}
			class={`${css.root} ${props.class ?? ''}`}
		>
			<Show when={props.text} fallback={props.children}>
				<Text variant="bodyXs">{props.text}</Text>
			</Show>
		</Dynamic>
	)
}
