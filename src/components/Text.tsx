import { Dynamic } from 'solid-js/web'
import { setDefaultProps } from '@/scripts/solid-helpers'
import type { ParentComponent } from 'solid-js'
import * as css from './Text.css'

const Text: ParentComponent<{ tag?: string; class?: string }> = (props) => {
	setDefaultProps(props, { tag: 'span', class: '' })

	return (
		<Dynamic
			classList={`${css.root} ${props.class}`}
			component={props.tag}
		>
			{props.children}
		</Dynamic>
	)
}

export default Text
