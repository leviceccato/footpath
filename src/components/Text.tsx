import { Dynamic } from 'solid-js/web'
import { setDefaultProps } from '@/scripts/solid-helpers'
import type { ParentComponent } from 'solid-js'
import * as css from './Text.css'

const Text: ParentComponent<{
	tag?: string
	class?: string
	variant:
		| 'body-xsmall'
		| 'body-small'
		| 'body-medium'
		| 'heading-small'
		| 'heading-medium'
		| 'heading-large'
}> = (props) => {
	setDefaultProps(props, { tag: 'span' })

	const variant = () => {
		const [style, size] = props.variant.split('-')
		return { style, size }
	}

	return (
		<Dynamic
			classList={`${css.root} ${css[variant().style]} ${css[variant().size]} ${
				props.class ?? ''
			}`}
			component={props.tag}
		>
			{props.children}
		</Dynamic>
	)
}

export default Text
