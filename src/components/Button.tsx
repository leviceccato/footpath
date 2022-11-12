import { Dynamic } from 'solid-js/web'
import type { ParentComponent, JSX } from 'solid-js'
import * as css from './Button.css'

import Text from '@/components/Text'

const Button: ParentComponent<
	JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
		class?: string
		href?: string
	}
> = (props) => {
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
		>
			<Text variant="bodyXs">{props.children}</Text>
		</Dynamic>
	)
}

export default Button
