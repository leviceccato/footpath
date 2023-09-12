import { Dynamic } from 'solid-js/web'
import { type ParentComponent } from 'solid-js'
import * as css from './Text.css'
import { type ClassProps, defaults } from '@/utils/misc'

const Text: ParentComponent<
	ClassProps & {
		tag?: string
		variant: keyof typeof css.variant
	}
> = (rawProps) => {
	const props = defaults(rawProps, { tag: 'span', class: '' })

	return (
		<Dynamic
			class={`${css.root} ${css.variant[props.variant]} ${props.class}`}
			component={props.tag}
		>
			{props.children}
		</Dynamic>
	)
}

export default Text
